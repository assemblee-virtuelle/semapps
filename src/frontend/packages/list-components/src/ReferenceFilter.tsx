/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */
import { useEffect, createElement, FunctionComponent } from 'react';
import {
  FilterList,
  FilterListItem,
  useGetList,
  useResourceContext,
  useListContext,
  useResourceDefinition,
  RaRecord,
  Identifier
} from 'react-admin';
import { useContainers } from '@semapps/semantic-data-provider';

/**
 * @example
 * const FilterAside = () => (
 *   <Card>
 *     <CardContent>
 *       <FilterLiveSearch source="pair:label" />
 *       <ReferenceFilter reference="Theme" source="pair:hasTopic" inverseSource="pair:topicOf" />
 *       <ReferenceFilter reference="Skill" source="pair:offers" inverseSource="pair:offeredBy" />
 *     </CardContent>
 *   </Card>
 * );
 */

// Converts an element to array or returns it if it's already an array
const toArray = <T,>(e: T | T[]) => ([] as T[]).concat(e);

type CounterProps = {
  source: string;
  id: Identifier;
};

const ReferenceFilterCounter: FunctionComponent<CounterProps> = ({ source, id }) => {
  const resourceContext = useResourceContext();
  // @ts-expect-error TS(2345): Argument of type 'ResourceContextValue' is not ass... Remove this comment to see the full error message
  const { data } = useGetList<RaRecord>(resourceContext, { pagination: { page: 1, perPage: Infinity } });

  return (
    <>
      &nbsp;
      {data && <span className="filter-count">{`(${data.filter(d => toArray(d[source]).includes(id)).length})`}</span>}
    </>
  );
};

type Props = {
  reference: string;
  source: string;
  inverseSource?: string;
  limit?: number;
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  filter?: Record<string, string>;
  label?: string;
  icon?: JSX.Element;
  showCounters?: boolean;
};

const ReferenceFilter = <ReferenceType extends RaRecord>({
  reference,
  source,
  inverseSource,
  limit = 25,
  sort,
  filter,
  label,
  icon,
  showCounters = true
}: Props) => {
  const { data, isLoading } = useGetList<ReferenceType>(reference, {
    pagination: { page: 1, perPage: limit },
    sort,
    filter
  });
  const currentResource = useResourceDefinition<ReferenceType>({ resource: reference });
  const resourceContext = useResourceContext();
  const resourceContextContainers = useContainers(resourceContext);

  const { setFilters } = useListContext();

  useEffect(() => {
    // Needed when filter item is active and its last relation is removed
    const urlSearchParams = new URLSearchParams(window.location.search);
    if (!urlSearchParams.get('filter') && !isLoading) {
      setFilters({}, []);
    }
  }, [isLoading, setFilters]);

  const itemIsUsed = (itemData: ReferenceType) => {
    if (!inverseSource) {
      return true;
    }

    if (!resourceContextContainers || !itemData) {
      return false;
    }

    return Object.values(resourceContextContainers)
      .flat()
      .some(containerUrl => {
        if (!itemData[inverseSource]) {
          return false;
        }

        return toArray(itemData[inverseSource]).some(inverseSourceData => {
          return inverseSourceData?.startsWith(containerUrl);
        });
      });
  };

  return (
    <FilterList
      label={label || currentResource?.options?.label || ''}
      icon={icon || currentResource?.icon ? createElement(currentResource.icon) : undefined}
    >
      {data &&
        data
          .filter(itemData => itemIsUsed(itemData))
          .map(itemData => (
            <FilterListItem
              key={itemData.id}
              label={
                <span className="filter-label">
                  {itemData['pair:label']}
                  {showCounters && <ReferenceFilterCounter source={source} id={itemData.id} />}
                </span>
              }
              value={{ [source]: itemData.id }}
            />
          ))}
    </FilterList>
  );
};

export default ReferenceFilter;
