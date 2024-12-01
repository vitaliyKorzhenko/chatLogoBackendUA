'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('teacher_customers', 'channelId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('teacher_customers', 'chatId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('teacher_customers', 'trackingCode', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('teacher_customers', 'channelId');
    await queryInterface.removeColumn('teacher_customers', 'chatId');
    await queryInterface.removeColumn('teacher_customers', 'trackingCode');
  },
};
