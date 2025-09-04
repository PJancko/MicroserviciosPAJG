const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Prestamo",
  tableName: "prestamo",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    usuario: {
      type: String,
    },
    fecha_prestamo: {
      type: String, // puedes usar Date si prefieres
    },
    fecha_devolucion: {
      type: String,
    },
  },
  relations: {
    libro: {
      type: "many-to-one",
      target: "Libro",
      joinColumn: true,
      eager: true,
    },
  },
});
