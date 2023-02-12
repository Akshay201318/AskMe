const roles = ['user', 'developer', 'service provider'];

const roleRights = new Map();
roleRights.set(roles[0], ['getArticles', 'manageArticles']);
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'getArticles', 'manageArticles']);

module.exports = {
  roles,
  roleRights,
};
