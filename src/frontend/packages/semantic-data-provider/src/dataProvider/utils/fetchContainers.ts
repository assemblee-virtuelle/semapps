import jsonld, { ContextDefinition } from 'jsonld';
import { GetListParams } from 'react-admin';
import arrayOf from './arrayOf';
import { Configuration, ContainerURI, DataServerKey } from '../types';

type LDPContainerType = 'ldp:Container' | 'ldp:BasicContainer';

interface LDPContainerBase {
  '@context': Configuration['jsonContext'];
  id: string;
  'ldp:contains': Record<string, any>[];
}

interface LDPContainerWithType extends LDPContainerBase {
  type: LDPContainerType | LDPContainerType[];
}

interface LDPContainerWithAtType extends LDPContainerBase {
  '@type': LDPContainerType | LDPContainerType[];
}

type LDPContainer = LDPContainerWithType | LDPContainerWithAtType;

type LDPResource = {
  '@context': Configuration['jsonContext'];
  [key: string]: any;
};

type ListFilters = Partial<{
  q: string;
  type: string;
  _predicates: string[];
  _servers: DataServerKey[];
  [attribute: string]: any;
}>;

const isValidLDPContainer = (container: LDPContainer) => {
  const resourceType = (container as LDPContainerWithType).type || (container as LDPContainerWithAtType)['@type'];
  return Array.isArray(resourceType) ? resourceType.includes('ldp:Container') : resourceType === 'ldp:Container';
};

const isObject = (val: any) => {
  return val != null && typeof val === 'object' && !Array.isArray(val);
};

const fetchContainers = async (
  containers: Record<DataServerKey, ContainerURI[]>,
  params: GetListParams,
  { httpClient, jsonContext }: Configuration
) => {
  const containersUri = Object.values(containers).flat();

  const fetchPromises = containersUri.map(containerUri =>
    httpClient(containerUri)
      .then(async ({ json }) => {
        const jsonResponse: LDPContainer = json;

        // If container's context is different, compact it to have an uniform result
        // TODO deep compare if the context is an object
        if (jsonResponse['@context'] !== jsonContext) {
          return jsonld.compact(jsonResponse, jsonContext as ContextDefinition) as unknown as Promise<LDPContainer>;
        }

        return jsonResponse;
      })
      .then((json: LDPContainer) => {
        if (!isValidLDPContainer(json)) {
          throw new Error(`${containerUri} is not a LDP container`);
        }

        return arrayOf(json['ldp:contains']).map<LDPResource>(resource => ({
          '@context': json['@context'],
          ...resource
        }));
      })
  );

  // Fetch simultaneously all containers
  const results = await Promise.all(fetchPromises);
  let resources = results.flat();

  resources = resources.map(resource => {
    resource.id = resource.id || resource['@id'];
    return resource;
  });

  // Apply filter to results
  const filters: ListFilters = params.filter;

  // For SPARQL queries, we use "a" to filter types, but in containers it must be "type"
  if (filters.a) {
    filters.type = filters.a;
    delete filters.a;
  }

  // Filter resources attributes according to _predicates list
  if (filters._predicates && Array.isArray(filters._predicates)) {
    const predicates = filters._predicates;
    const mandatoryAttributes = ['id'];

    resources = resources.map(resource => {
      return Object.keys(resource)
        .filter(key => predicates.includes(key) || mandatoryAttributes.includes(key))
        .reduce<LDPResource>(
          (filteredResource, key) => {
            filteredResource[key] = resource[key];
            return filteredResource;
          },
          { '@context': [] }
        );
    });
  }

  if (Object.keys(filters).filter(f => !['_predicates', '_servers'].includes(f)).length > 0) {
    resources = resources.filter(resource => {
      // Full text filtering
      if (filters.q) {
        return Object.values(resource).some(attributeValue => {
          if (!isObject(attributeValue)) {
            const arrayValues = Array.isArray(attributeValue) ? attributeValue : [attributeValue];
            return arrayValues.some(value => {
              if (typeof value === 'string') {
                return value.toLowerCase().normalize('NFD').includes(filters.q!.toLowerCase().normalize('NFD'));
              }
              return false;
            });
          }
          return false;
        });
      }

      // Attribute filtering
      const attributesFilters = Object.keys(filters).filter(f => !['_predicates', '_servers', 'q'].includes(f));

      return attributesFilters.every(attribute => {
        if (resource[attribute]) {
          const arrayValues: any[] = Array.isArray(resource[attribute]) ? resource[attribute] : [resource[attribute]];
          return arrayValues.some(
            (value: any) => typeof value === 'string' && value.includes(filters[attribute] as string)
          );
        }

        return false;
      });
    });
  }

  // Sorting
  if (params.sort) {
    resources = resources.sort((a, b) => {
      if (params.sort.order === 'ASC') {
        return (a[params.sort.field] ?? '').localeCompare(b[params.sort.field] ?? '');
      }
      return (b[params.sort.field] ?? '').localeCompare(a[params.sort.field] ?? '');
    });
  }

  // Pagination
  const total = resources.length;

  if (params.pagination) {
    resources = resources.slice(
      (params.pagination.page - 1) * params.pagination.perPage,
      params.pagination.page * params.pagination.perPage
    );
  }

  return { data: resources, total };
};

export default fetchContainers;
