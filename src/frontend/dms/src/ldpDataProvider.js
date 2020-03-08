// const extractId = uri => uri.match(/[^/]+$/)[0];

const ldpDataProvider = baseUrl => ({
  getList: async (resource, params) => {
    const data = await fetch(baseUrl + 'pair:' + resource, {
      headers: {
        Accept: 'application/ld+json',
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVNXpSenhWMmZpaHpkWXkzNVl2ZkJSajVFX0h1UmpRRENOc29vc1J1RzU4In0.eyJqdGkiOiIzMmZjMGI1OC01NjFiLTQxMDktYTdjYy1jNjRjMDg0NjgzMmEiLCJleHAiOjE1ODMyNTIyMTUsIm5iZiI6MCwiaWF0IjoxNTgzMjUyMTU1LCJpc3MiOiJodHRwczovL2xvZ2luLmxlc2NvbW11bnMub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5ZGIyODE0NS01NjkzLTQ5NmYtOTExYS0wZjMxNDQ2MGNkYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZW1hcHBzIiwiYXV0aF90aW1lIjoxNTgzMjI4MzA4LCJzZXNzaW9uX3N0YXRlIjoiNmE0NDU1ODMtNjVmZi00MGI1LWJlZjAtNmZhM2UwMzE5YjMxIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQiLCJuYW1lIjoiU8OpYmFzdGllbiBST1NTRVQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzcm9zc2V0ODFAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlPDqWJhc3RpZW4iLCJmYW1pbHlfbmFtZSI6IlJPU1NFVCIsImVtYWlsIjoic3Jvc3NldDgxQGdtYWlsLmNvbSJ9.j5uMYhwsBQAUk6HiPxFEePCnVINognIZxQj59Q2VxAB8HMuR9wxJMqtAqrWNKYzaRhzsPaJsKDL6GcDLnnLpjr06B12WUYkYg_smaxjIbPZAH_SPKK8AnDy97d61qka4b9EpKxHTtxBS8TRb7V7VOzbUI_8HbEbqdDY11qQOvCVTRf7dDjeEpm0TAmMtMHG_tLe1qTwX0d6HfkOXI5PHHxmd7HUkBrHxsDh6bM8c8Jr-uZKCcq3kUiKneIsP2ErKM-AFmJDX8cxH-G1Q9qQSosIWzq5wkG1C4d3J7emARLaUwwgFuz-6tJ-Ovo7jwPQdCUYWhbYSmY4DaLwNSUB-gA'
      }
    });

    const json = await data.json();

    const returnData = json['ldp:contains'].map(item => {
      item.id = item['@id'];
      return item;
    });

    return { data: returnData, total: returnData.length };
  },
  getOne: async (resource, params) => {
    const data = await fetch(params.id, {
      headers: {
        Accept: 'application/ld+json',
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVNXpSenhWMmZpaHpkWXkzNVl2ZkJSajVFX0h1UmpRRENOc29vc1J1RzU4In0.eyJqdGkiOiIzMmZjMGI1OC01NjFiLTQxMDktYTdjYy1jNjRjMDg0NjgzMmEiLCJleHAiOjE1ODMyNTIyMTUsIm5iZiI6MCwiaWF0IjoxNTgzMjUyMTU1LCJpc3MiOiJodHRwczovL2xvZ2luLmxlc2NvbW11bnMub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5ZGIyODE0NS01NjkzLTQ5NmYtOTExYS0wZjMxNDQ2MGNkYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZW1hcHBzIiwiYXV0aF90aW1lIjoxNTgzMjI4MzA4LCJzZXNzaW9uX3N0YXRlIjoiNmE0NDU1ODMtNjVmZi00MGI1LWJlZjAtNmZhM2UwMzE5YjMxIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQiLCJuYW1lIjoiU8OpYmFzdGllbiBST1NTRVQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzcm9zc2V0ODFAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlPDqWJhc3RpZW4iLCJmYW1pbHlfbmFtZSI6IlJPU1NFVCIsImVtYWlsIjoic3Jvc3NldDgxQGdtYWlsLmNvbSJ9.j5uMYhwsBQAUk6HiPxFEePCnVINognIZxQj59Q2VxAB8HMuR9wxJMqtAqrWNKYzaRhzsPaJsKDL6GcDLnnLpjr06B12WUYkYg_smaxjIbPZAH_SPKK8AnDy97d61qka4b9EpKxHTtxBS8TRb7V7VOzbUI_8HbEbqdDY11qQOvCVTRf7dDjeEpm0TAmMtMHG_tLe1qTwX0d6HfkOXI5PHHxmd7HUkBrHxsDh6bM8c8Jr-uZKCcq3kUiKneIsP2ErKM-AFmJDX8cxH-G1Q9qQSosIWzq5wkG1C4d3J7emARLaUwwgFuz-6tJ-Ovo7jwPQdCUYWhbYSmY4DaLwNSUB-gA'
      }
    });

    const json = await data.json();
    json.id = json['@id'];

    return { data: json };
  },
  getMany: async (resource, params) => {
    let returnData = [];

    for( let id of params.ids ) {
      id = typeof id === 'object' ? id['@id'] : id;
      const data = await fetch(id, {
        headers: {
          Accept: 'application/ld+json',
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVNXpSenhWMmZpaHpkWXkzNVl2ZkJSajVFX0h1UmpRRENOc29vc1J1RzU4In0.eyJqdGkiOiIzMmZjMGI1OC01NjFiLTQxMDktYTdjYy1jNjRjMDg0NjgzMmEiLCJleHAiOjE1ODMyNTIyMTUsIm5iZiI6MCwiaWF0IjoxNTgzMjUyMTU1LCJpc3MiOiJodHRwczovL2xvZ2luLmxlc2NvbW11bnMub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5ZGIyODE0NS01NjkzLTQ5NmYtOTExYS0wZjMxNDQ2MGNkYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZW1hcHBzIiwiYXV0aF90aW1lIjoxNTgzMjI4MzA4LCJzZXNzaW9uX3N0YXRlIjoiNmE0NDU1ODMtNjVmZi00MGI1LWJlZjAtNmZhM2UwMzE5YjMxIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQiLCJuYW1lIjoiU8OpYmFzdGllbiBST1NTRVQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzcm9zc2V0ODFAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlPDqWJhc3RpZW4iLCJmYW1pbHlfbmFtZSI6IlJPU1NFVCIsImVtYWlsIjoic3Jvc3NldDgxQGdtYWlsLmNvbSJ9.j5uMYhwsBQAUk6HiPxFEePCnVINognIZxQj59Q2VxAB8HMuR9wxJMqtAqrWNKYzaRhzsPaJsKDL6GcDLnnLpjr06B12WUYkYg_smaxjIbPZAH_SPKK8AnDy97d61qka4b9EpKxHTtxBS8TRb7V7VOzbUI_8HbEbqdDY11qQOvCVTRf7dDjeEpm0TAmMtMHG_tLe1qTwX0d6HfkOXI5PHHxmd7HUkBrHxsDh6bM8c8Jr-uZKCcq3kUiKneIsP2ErKM-AFmJDX8cxH-G1Q9qQSosIWzq5wkG1C4d3J7emARLaUwwgFuz-6tJ-Ovo7jwPQdCUYWhbYSmY4DaLwNSUB-gA'
        }
      });

      const json = await data.json();
      json.id = json['@id'];

      returnData[json.id] = json;
    }

    return { data: returnData };
  },
  getManyReference: (resource, params) => (new Promise()),
  create: async (resource, params) => {
    const response = await fetch(baseUrl + 'pair:' + resource, {
      method: 'POST',
      headers: {
        Accept: 'application/ld+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVNXpSenhWMmZpaHpkWXkzNVl2ZkJSajVFX0h1UmpRRENOc29vc1J1RzU4In0.eyJqdGkiOiIzMmZjMGI1OC01NjFiLTQxMDktYTdjYy1jNjRjMDg0NjgzMmEiLCJleHAiOjE1ODMyNTIyMTUsIm5iZiI6MCwiaWF0IjoxNTgzMjUyMTU1LCJpc3MiOiJodHRwczovL2xvZ2luLmxlc2NvbW11bnMub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5ZGIyODE0NS01NjkzLTQ5NmYtOTExYS0wZjMxNDQ2MGNkYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZW1hcHBzIiwiYXV0aF90aW1lIjoxNTgzMjI4MzA4LCJzZXNzaW9uX3N0YXRlIjoiNmE0NDU1ODMtNjVmZi00MGI1LWJlZjAtNmZhM2UwMzE5YjMxIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQiLCJuYW1lIjoiU8OpYmFzdGllbiBST1NTRVQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzcm9zc2V0ODFAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlPDqWJhc3RpZW4iLCJmYW1pbHlfbmFtZSI6IlJPU1NFVCIsImVtYWlsIjoic3Jvc3NldDgxQGdtYWlsLmNvbSJ9.j5uMYhwsBQAUk6HiPxFEePCnVINognIZxQj59Q2VxAB8HMuR9wxJMqtAqrWNKYzaRhzsPaJsKDL6GcDLnnLpjr06B12WUYkYg_smaxjIbPZAH_SPKK8AnDy97d61qka4b9EpKxHTtxBS8TRb7V7VOzbUI_8HbEbqdDY11qQOvCVTRf7dDjeEpm0TAmMtMHG_tLe1qTwX0d6HfkOXI5PHHxmd7HUkBrHxsDh6bM8c8Jr-uZKCcq3kUiKneIsP2ErKM-AFmJDX8cxH-G1Q9qQSosIWzq5wkG1C4d3J7emARLaUwwgFuz-6tJ-Ovo7jwPQdCUYWhbYSmY4DaLwNSUB-gA'
      },
      body: JSON.stringify({
        '@context': { 'pair': 'http://virtual-assembly.org/ontologies/pair#' },
        '@type': resource,
        ...params.data
      })
    });

    const resourceUri = response.headers.get('Location');

    const data = await fetch(resourceUri, {
      headers: {
        Accept: 'application/ld+json',
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVNXpSenhWMmZpaHpkWXkzNVl2ZkJSajVFX0h1UmpRRENOc29vc1J1RzU4In0.eyJqdGkiOiIzMmZjMGI1OC01NjFiLTQxMDktYTdjYy1jNjRjMDg0NjgzMmEiLCJleHAiOjE1ODMyNTIyMTUsIm5iZiI6MCwiaWF0IjoxNTgzMjUyMTU1LCJpc3MiOiJodHRwczovL2xvZ2luLmxlc2NvbW11bnMub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5ZGIyODE0NS01NjkzLTQ5NmYtOTExYS0wZjMxNDQ2MGNkYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZW1hcHBzIiwiYXV0aF90aW1lIjoxNTgzMjI4MzA4LCJzZXNzaW9uX3N0YXRlIjoiNmE0NDU1ODMtNjVmZi00MGI1LWJlZjAtNmZhM2UwMzE5YjMxIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQiLCJuYW1lIjoiU8OpYmFzdGllbiBST1NTRVQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzcm9zc2V0ODFAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlPDqWJhc3RpZW4iLCJmYW1pbHlfbmFtZSI6IlJPU1NFVCIsImVtYWlsIjoic3Jvc3NldDgxQGdtYWlsLmNvbSJ9.j5uMYhwsBQAUk6HiPxFEePCnVINognIZxQj59Q2VxAB8HMuR9wxJMqtAqrWNKYzaRhzsPaJsKDL6GcDLnnLpjr06B12WUYkYg_smaxjIbPZAH_SPKK8AnDy97d61qka4b9EpKxHTtxBS8TRb7V7VOzbUI_8HbEbqdDY11qQOvCVTRf7dDjeEpm0TAmMtMHG_tLe1qTwX0d6HfkOXI5PHHxmd7HUkBrHxsDh6bM8c8Jr-uZKCcq3kUiKneIsP2ErKM-AFmJDX8cxH-G1Q9qQSosIWzq5wkG1C4d3J7emARLaUwwgFuz-6tJ-Ovo7jwPQdCUYWhbYSmY4DaLwNSUB-gA'
      }
    });

    const json = await data.json();
    json.id = json['@id'];

    return { data: json };
  },
  update: async (resource, params) => {
    await fetch(params.id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVNXpSenhWMmZpaHpkWXkzNVl2ZkJSajVFX0h1UmpRRENOc29vc1J1RzU4In0.eyJqdGkiOiIzMmZjMGI1OC01NjFiLTQxMDktYTdjYy1jNjRjMDg0NjgzMmEiLCJleHAiOjE1ODMyNTIyMTUsIm5iZiI6MCwiaWF0IjoxNTgzMjUyMTU1LCJpc3MiOiJodHRwczovL2xvZ2luLmxlc2NvbW11bnMub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5ZGIyODE0NS01NjkzLTQ5NmYtOTExYS0wZjMxNDQ2MGNkYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZW1hcHBzIiwiYXV0aF90aW1lIjoxNTgzMjI4MzA4LCJzZXNzaW9uX3N0YXRlIjoiNmE0NDU1ODMtNjVmZi00MGI1LWJlZjAtNmZhM2UwMzE5YjMxIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQiLCJuYW1lIjoiU8OpYmFzdGllbiBST1NTRVQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzcm9zc2V0ODFAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlPDqWJhc3RpZW4iLCJmYW1pbHlfbmFtZSI6IlJPU1NFVCIsImVtYWlsIjoic3Jvc3NldDgxQGdtYWlsLmNvbSJ9.j5uMYhwsBQAUk6HiPxFEePCnVINognIZxQj59Q2VxAB8HMuR9wxJMqtAqrWNKYzaRhzsPaJsKDL6GcDLnnLpjr06B12WUYkYg_smaxjIbPZAH_SPKK8AnDy97d61qka4b9EpKxHTtxBS8TRb7V7VOzbUI_8HbEbqdDY11qQOvCVTRf7dDjeEpm0TAmMtMHG_tLe1qTwX0d6HfkOXI5PHHxmd7HUkBrHxsDh6bM8c8Jr-uZKCcq3kUiKneIsP2ErKM-AFmJDX8cxH-G1Q9qQSosIWzq5wkG1C4d3J7emARLaUwwgFuz-6tJ-Ovo7jwPQdCUYWhbYSmY4DaLwNSUB-gA'
      },
      body: JSON.stringify(params.data)
    });

    return { data: params.data };
  },
  updateMany: (resource, params) => (new Promise()),
  delete: async (resource, params) => {
    await fetch(params.id, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVNXpSenhWMmZpaHpkWXkzNVl2ZkJSajVFX0h1UmpRRENOc29vc1J1RzU4In0.eyJqdGkiOiIzMmZjMGI1OC01NjFiLTQxMDktYTdjYy1jNjRjMDg0NjgzMmEiLCJleHAiOjE1ODMyNTIyMTUsIm5iZiI6MCwiaWF0IjoxNTgzMjUyMTU1LCJpc3MiOiJodHRwczovL2xvZ2luLmxlc2NvbW11bnMub3JnL2F1dGgvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI5ZGIyODE0NS01NjkzLTQ5NmYtOTExYS0wZjMxNDQ2MGNkYmUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZW1hcHBzIiwiYXV0aF90aW1lIjoxNTgzMjI4MzA4LCJzZXNzaW9uX3N0YXRlIjoiNmE0NDU1ODMtNjVmZi00MGI1LWJlZjAtNmZhM2UwMzE5YjMxIiwiYWNyIjoiMCIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQiLCJuYW1lIjoiU8OpYmFzdGllbiBST1NTRVQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzcm9zc2V0ODFAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlPDqWJhc3RpZW4iLCJmYW1pbHlfbmFtZSI6IlJPU1NFVCIsImVtYWlsIjoic3Jvc3NldDgxQGdtYWlsLmNvbSJ9.j5uMYhwsBQAUk6HiPxFEePCnVINognIZxQj59Q2VxAB8HMuR9wxJMqtAqrWNKYzaRhzsPaJsKDL6GcDLnnLpjr06B12WUYkYg_smaxjIbPZAH_SPKK8AnDy97d61qka4b9EpKxHTtxBS8TRb7V7VOzbUI_8HbEbqdDY11qQOvCVTRf7dDjeEpm0TAmMtMHG_tLe1qTwX0d6HfkOXI5PHHxmd7HUkBrHxsDh6bM8c8Jr-uZKCcq3kUiKneIsP2ErKM-AFmJDX8cxH-G1Q9qQSosIWzq5wkG1C4d3J7emARLaUwwgFuz-6tJ-Ovo7jwPQdCUYWhbYSmY4DaLwNSUB-gA'
      }
    });

    return { data: { id: params.id } };
  },
  deleteMany: (resource, params) => (new Promise()),
});

export default ldpDataProvider;