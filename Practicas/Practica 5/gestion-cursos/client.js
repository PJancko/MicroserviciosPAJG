// cliente.js
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

// Crear cliente
const client = new proto.UniversidadService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// 1. Agregar un estudiante
client.AgregarEstudiante(
  { ci: '123', nombres: 'Pablo', apellidos: 'Jancko', carrera: 'Ing. Sistemas' },
  (err, res) => {
    if (err) return console.error('Error AgregarEstudiante:', err.message);
    console.log('AgregarEstudiante:', res);

    // 2. Agregar un curso
    client.AgregarCurso(
      { codigo: 'INF101', nombre: 'Programación I', docente: 'Dr. Smith' },
      (err, res) => {
        if (err) return console.error('Error AgregarCurso:', err.message);
        console.log('AgregarCurso:', res);

        // 3. Inscribir estudiante en curso
        client.InscribirEstudiante(
          { ci: '123', codigo: 'INF101' },
          (err, res) => {
            if (err) return console.error('Error InscribirEstudiante:', err.message);
            console.log('InscribirEstudiante:', res);

            // 4. Listar cursos de estudiante
            client.ListarCursosDeEstudiante({ ci: '123' }, (err, res) => {
              if (err) return console.error('Error ListarCursosDeEstudiante:', err.message);
              console.log('ListarCursosDeEstudiante:', res);

              // 5. Listar estudiantes de curso
              client.ListarEstudiantesDeCurso({ codigo: 'INF101' }, (err, res) => {
                if (err) return console.error('Error ListarEstudiantesDeCurso:', err.message);
                console.log('ListarEstudiantesDeCurso:', res);
              });
            });
          }
        );
      }
    );
  }
);
