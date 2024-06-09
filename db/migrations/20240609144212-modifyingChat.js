'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('chats', 'chat_contents', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await queryInterface.changeColumn('chats', 'chat_content', {
    //   type: Sequelize.TEXT,
    //   allowNull: true,
    // });

    await queryInterface.removeColumn('chats', 'chat_contents', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },
};
