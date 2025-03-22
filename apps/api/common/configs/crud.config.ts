export const crudConfig = {
  query: {
    limit: 100,
    cache: 200,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
};
