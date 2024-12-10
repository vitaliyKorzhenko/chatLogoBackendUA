'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('chat_messages', 'source', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    //isBound message
    await queryInterface.addColumn('chat_messages', 'inBound', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('chat_messages', 'serverId');

    //isBound message
    await queryInterface.removeColumn('chat_messages', 'inBound');
  },
};
