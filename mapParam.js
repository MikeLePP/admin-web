const riskModel = [
  {
    code: 'I1',
    name: 'Number consecutive pay...',
    parameters: [
      {
        name: 'weekly',
        values: {
          50: '6',
          75: '6',
          100: '8',
        },
      },
      {
        name: 'fortnightly',
        values: {
          50: '6',
          75: '6',
          100: '8',
        },
      },
      {
        name: 'monthly',
        values: {
          50: '6',
          75: '6',
          100: '8',
        },
      },
    ],
  },
  {
    code: 'I2',
    name: 'Average income per cycle',
    parameters: [
      {
        name: 'default',
        values: {
          50: '6',
          75: '6',
          100: '8',
        },
      },
    ],
  },
];

const mapParam = () => {
  const tableData = riskModel.map((riskModelItem) => {
    if (riskModelItem.parameters.length > 1) {
      return [
        {
          code: riskModelItem.code,
          name: riskModelItem.name,
          isTitle: true,
        },
        ...riskModelItem.parameters.map((parameter) => ({
          name: parameter.name,
          ...parameter.values,
        })),
      ];
    } else {
      return [
        {
          code: riskModelItem.code,
          name: riskModelItem.name,
          isTitle: true,
          ...riskModelItem.parameters[0].values,
        },
      ];
    }
  });

  const result = tableData.flat();

  console.log(result);
};

mapParam();
