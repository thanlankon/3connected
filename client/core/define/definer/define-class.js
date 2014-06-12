define.construct = function (id, definer) {

  define(id, function (module, require) {

    var construct = {};

    definer(control, require);

    var baseConstruct = require(construct.base || 'core.construct.Construct');

    var staticMembers = control.static || {};
    var instanceMembers = control.instance || {};

    module.exports = baseConstruct.extend(staticMembers, instanceMembers);

  });

};
