module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('featureSetting', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM,
        values: [
          'global',
          'local',
        ],
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      min: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 1000000,
      },
      fee: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      maxSampleSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 400,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'group',
          key: 'id',
        },
      },
      channelId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'channel',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('featureSetting');
  },
};
