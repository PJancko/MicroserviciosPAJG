const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, 'cursos_estudiantes.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = grpc.loadPackageDefinition(packageDef).universidad;

// Almacenamiento en memoria
const estudiantes = new Map(); // ci -> estudiante obj
const cursos = new Map(); // codigo -> curso obj

// inscripciones: studentCi -> Set(codigo)
const inscripcionesPorEstudiante = new Map();
// curso -> Set(ci)
const inscripcionesPorCurso = new Map();

function AgregarEstudiante(call, callback) {
  const e = call.request;
  if (!e.ci) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: 'ci es obligatorio'
    });
  }
  if (estudiantes.has(e.ci)) {
    // podríamos devolver ALREADY_EXISTS o simplemente actualizar; enunciado no exige este caso
    return callback(null, {
      ok: false,
      mensaje: `Estudiante con CI ${e.ci} ya existe.`,
      estudiante: estudiantes.get(e.ci)
    });
  }
  const est = {
    ci: e.ci,
    nombres: e.nombres,
    apellidos: e.apellidos,
    carrera: e.carrera
  };
  estudiantes.set(e.ci, est);
  inscripcionesPorEstudiante.set(e.ci, new Set());
  callback(null, { ok: true, mensaje: 'Estudiante agregado', estudiante: est });
}

function AgregarCurso(call, callback) {
  const c = call.request;
  if (!c.codigo) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: 'codigo es obligatorio'
    });
  }
  if (cursos.has(c.codigo)) {
    return callback(null, {
      ok: false,
      mensaje: `Curso con código ${c.codigo} ya existe.`,
      curso: cursos.get(c.codigo)
    });
  }
  const curso = { codigo: c.codigo, nombre: c.nombre, docente: c.docente };
  cursos.set(c.codigo, curso);
  inscripcionesPorCurso.set(c.codigo, new Set());
  callback(null, { ok: true, mensaje: 'Curso agregado', curso });
}

function InscribirEstudiante(call, callback) {
  const { ci, codigo } = call.request;
  if (!ci || !codigo) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: 'ci y codigo son obligatorios'
    });
  }
  if (!estudiantes.has(ci)) {
    return callback({
      code: grpc.status.NOT_FOUND,
      details: `Estudiante con CI ${ci} no encontrado`
    });
  }
  if (!cursos.has(codigo)) {
    return callback({
      code: grpc.status.NOT_FOUND,
      details: `Curso con código ${codigo} no encontrado`
    });
  }

  const cursosDelEst = inscripcionesPorEstudiante.get(ci);
  const estudiantesDelCurso = inscripcionesPorCurso.get(codigo);

  if (cursosDelEst.has(codigo)) {
    // ya está inscrito => ALREADY_EXISTS
    return callback({
      code: grpc.status.ALREADY_EXISTS,
      details: `Estudiante ${ci} ya inscrito en curso ${codigo}`
    });
  }

  cursosDelEst.add(codigo);
  estudiantesDelCurso.add(ci);

  callback(null, { ok: true, mensaje: `Inscripción exitosa: ${ci} -> ${codigo}` });
}

function ListarCursosDeEstudiante(call, callback) {
  const { ci } = call.request;
  if (!ci) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: 'ci es obligatorio'
    });
  }
  if (!estudiantes.has(ci)) {
    return callback({
      code: grpc.status.NOT_FOUND,
      details: `Estudiante con CI ${ci} no encontrado`
    });
  }
  const codigos = Array.from(inscripcionesPorEstudiante.get(ci) || []);
  const listaCursos = codigos.map(codigo => cursos.get(codigo)).filter(Boolean);
  callback(null, { cursos: listaCursos });
}

function ListarEstudiantesDeCurso(call, callback) {
  const { codigo } = call.request;
  if (!codigo) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: 'codigo es obligatorio'
    });
  }
  if (!cursos.has(codigo)) {
    return callback({
      code: grpc.status.NOT_FOUND,
      details: `Curso con código ${codigo} no encontrado`
    });
  }
  const cis = Array.from(inscripcionesPorCurso.get(codigo) || []);
  const listaEst = cis.map(ci => estudiantes.get(ci)).filter(Boolean);
  callback(null, { estudiantes: listaEst });
}

function main() {
  const server = new grpc.Server();
  server.addService(proto.UniversidadService.service, {
    AgregarEstudiante,
    AgregarCurso,
    InscribirEstudiante,
    ListarCursosDeEstudiante,
    ListarEstudiantesDeCurso
  });

  const port = '0.0.0.0:50051';
  server.bindAsync(port, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
      console.error('Error bind server:', err);
      return;
    }
    console.log(`Servidor gRPC escuchando en ${port}`);
    server.start();
  });
}

main();
