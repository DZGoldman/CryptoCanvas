module.exports =function (sequelize, Datatypes) {
    return sequelize.define('drawing', {
      ink_string: Datatypes.STRING,
      artist: Datatypes.STRING ,
  })
}
  