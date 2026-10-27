-- ReformDidad · base de datos de demostración
-- Datos 100 % ficticios. Contraseñas guardadas con bcrypt (password_hash de PHP).
-- Cuentas de prueba (CÁMBIALAS antes de publicar la web):
--   Administrador  -> usuario: Administrador      contraseña: Admin_Demo1!
--   Empleados      -> usuario: empleado_demo1..3  contraseña: Empleado_Demo1!
--   Clientes       -> usuario: Marta_V, Carlos_R… contraseña: Cliente_Demo1!
-- Importa este archivo EN una base de datos ya creada (no incluye CREATE DATABASE).

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 31-05-2024 a las 14:17:46
-- Versión del servidor: 10.5.23-MariaDB-0+deb11u1
-- Versión de PHP: 8.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reformdidad_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Documentos_favoritos`
--

CREATE TABLE `Documentos_favoritos` (
  `id_documento_reforma` int(11) NOT NULL,
  `id_usuario_documento` int(11) NOT NULL,
  `id_reforma_documento` int(11) NOT NULL,
  `es_favorito` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Documentos_favoritos`
--

INSERT INTO `Documentos_favoritos` (`id_documento_reforma`, `id_usuario_documento`, `id_reforma_documento`, `es_favorito`) VALUES
(1, 6, 1, 0),
(2, 2, 3, 0),
(3, 2, 6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Empleados`
--

CREATE TABLE `Empleados` (
  `id_empleado` int(11) NOT NULL,
  `nombre_empleado` varchar(50) NOT NULL,
  `dni_empleado` varchar(9) NOT NULL,
  `email_empleado` varchar(60) NOT NULL,
  `password_empleado` varchar(255) NOT NULL,
  `num_tlf_empleado` int(9) NOT NULL,
  `tipo_usuario_global` int(11) NOT NULL,
  `tipo_empleado` tinyint(4) NOT NULL,
  `supervisor_empleado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Empleados`
--

INSERT INTO `Empleados` (`id_empleado`, `nombre_empleado`, `dni_empleado`, `email_empleado`, `password_empleado`, `num_tlf_empleado`, `tipo_usuario_global`, `tipo_empleado`, `supervisor_empleado`) VALUES
(1, 'empleado_demo1', '20000001B', 'empleado1@example.com', '$2y$12$n2.bP/aJTbLJH.XkDrLLOu3vOwzPtSZ.GvAtv7byGZYXTbuN9v.2q', 610000001, 2, 1, 3),
(2, 'empleado_demo2', '20000002B', 'empleado2@example.com', '$2y$12$n2.bP/aJTbLJH.XkDrLLOu3vOwzPtSZ.GvAtv7byGZYXTbuN9v.2q', 610000002, 2, 3, 5),
(3, 'empleado_demo3', '20000003B', 'empleado3@example.com', '$2y$12$n2.bP/aJTbLJH.XkDrLLOu3vOwzPtSZ.GvAtv7byGZYXTbuN9v.2q', 610000003, 2, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `FAQ`
--

CREATE TABLE `FAQ` (
  `id_faq` tinyint(11) NOT NULL,
  `pregunta` text NOT NULL,
  `respuesta` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `FAQ`
--

INSERT INTO `FAQ` (`id_faq`, `pregunta`, `respuesta`) VALUES
(1, '¿Qué tipo de servicios de reforma ofrecen?', 'Ofrecemos una amplia gama de servicios de reforma, que incluyen renovaciones completas de viviendas, remodelaciones de cocinas y baños, ampliaciones de espacios, reformas parciales, cambios de distribución, instalación de nuevos sistemas y mucho más.'),
(2, '¿Cuánto tiempo tarda en completarse una reforma?', 'El tiempo necesario para completar una reforma depende del alcance del proyecto. Proveemos estimaciones detalladas de tiempo basadas en la complejidad y tamaño del trabajo requerido. Nuestro objetivo es completar cada proyecto de manera eficiente sin comprometer la calidad.'),
(3, '¿Cómo puedo solicitar un presupuesto para mi proyecto de reforma?', 'Puedes solicitar un presupuesto gratuito contactándonos a través de nuestro formulario en línea, por teléfono o por correo electrónico. Uno de nuestros expertos se pondrá en contacto contigo para discutir tus necesidades y proporcionarte un presupuesto detallado y personalizado.'),
(4, '¿Qué tipo de materiales utilizan en sus proyectos de reforma?', 'Utilizamos materiales de la más alta calidad disponibles en el mercado. Nos asociamos con proveedores confiables y marcas reconocidas para garantizar la durabilidad, funcionalidad y estética de cada proyecto.'),
(5, '¿Proporcionan garantía para sus servicios de reforma?', 'Sí, respaldamos nuestro trabajo con una garantía de satisfacción del cliente. Si no estás completamente satisfecho con el resultado final, haremos todo lo posible para corregir cualquier problema que pueda surgir.'),
(6, '¿Cómo puedo programar una consulta o una visita para discutir mi proyecto?', 'Puedes programar una consulta o una visita en tu domicilio contactándonos por teléfono o a través de nuestro formulario en línea. Estaremos encantados de discutir tus ideas, responder tus preguntas y proporcionarte orientación profesional.'),
(7, '¿Cuál es el proceso de trabajo desde el inicio hasta la finalización del proyecto?', 'Nuestro proceso de trabajo comienza con una consulta inicial para comprender tus necesidades y expectativas. Luego, procedemos con el diseño y planificación del proyecto, seguido por la ejecución de las reformas. Te mantenemos informado en cada etapa del proceso y nos aseguramos de que estés satisfecho con el resultado final.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Jefes`
--

CREATE TABLE `Jefes` (
  `id_jefe` int(11) NOT NULL,
  `nombre_completo_jefe` varchar(100) NOT NULL,
  `dni_jefe` varchar(9) NOT NULL,
  `jefe_activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Jefes`
--

INSERT INTO `Jefes` (`id_jefe`, `nombre_completo_jefe`, `dni_jefe`, `jefe_activo`) VALUES
(2, 'Antonio Pérez Ruiz', '30000002C', 1),
(3, 'Lucía Fernández Gil', '30000003C', 1),
(4, 'Miguel Ángel Soto', '30000004C', 1),
(5, 'Carmen Ortiz Vidal', '30000005C', 1),
(6, 'Rafael Navarro León', '30000006C', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Metros_reforma`
--

CREATE TABLE `Metros_reforma` (
  `id_metros` int(2) NOT NULL,
  `cantidad_metros` varchar(12) NOT NULL,
  `calculo_metros` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Metros_reforma`
--

INSERT INTO `Metros_reforma` (`id_metros`, `cantidad_metros`, `calculo_metros`) VALUES
(1, '5 <', 15),
(2, '5 - 10', 16),
(3, '10 - 15', 18),
(4, '15 - 25', 20),
(5, '25 - 50', 22),
(6, '50 >', 25);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Proyecto_reforma`
--

CREATE TABLE `Proyecto_reforma` (
  `id_reforma` int(11) NOT NULL,
  `usuario_solicitante` int(11) NOT NULL,
  `reforma_aprobada` tinyint(1) DEFAULT NULL,
  `zona_reforma` int(11) NOT NULL,
  `tipo_reforma` int(11) NOT NULL,
  `metros_aprox_reforma` int(11) NOT NULL,
  `precio_aprox` decimal(8,2) NOT NULL,
  `jefe_seleccionado` int(11) DEFAULT NULL,
  `descripcion_reforma` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_finalizacion` date DEFAULT NULL,
  `finalizado` tinyint(1) NOT NULL,
  `foto_antes` varchar(60) DEFAULT NULL,
  `foto_despues` varchar(60) DEFAULT NULL,
  `campo_reforma_pdf` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Proyecto_reforma`
--

INSERT INTO `Proyecto_reforma` (`id_reforma`, `usuario_solicitante`, `reforma_aprobada`, `zona_reforma`, `tipo_reforma`, `metros_aprox_reforma`, `precio_aprox`, `jefe_seleccionado`, `descripcion_reforma`, `fecha_inicio`, `fecha_finalizacion`, `finalizado`, `foto_antes`, `foto_despues`, `campo_reforma_pdf`) VALUES
(1, 6, 1, 9, 2, 3, 16000.00, 4, 'El cliente quiere que la reforma sea espectacular.\r\nRealizarla lo más pronto posible.', '2024-05-25', '2024-06-03', 1, 'img_reformas/reforma_antes_1.jpg', 'img_reformas/reforma_despues_1.jpg', 'reportes_reformas/reporte_reforma_1.pdf'),
(2, 2, 0, 8, 5, 3, 2030.00, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL),
(3, 2, 1, 9, 2, 4, 15200.00, 4, 'Quiere que todo esté perfecto. Cuando se realice la reforma, avisar con antelación al cliente.', '2024-05-27', '2024-06-09', 1, 'img_reformas/reforma_antes_3.jpg', 'img_reformas/reforma_despues_3.jpg', 'reportes_reformas/reporte_reforma_3.pdf'),
(4, 2, NULL, 11, 4, 2, 9050.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(5, 2, NULL, 10, 4, 1, 20780.00, NULL, 'prueba solicitud', '2024-05-17', NULL, 0, NULL, NULL, NULL),
(6, 2, 1, 12, 4, 4, 18700.00, 3, 'El cliente quiere una reforma impecable. Intentar no ensuciar tanto las demás habitaciones.', '2024-05-30', '2024-06-17', 1, 'img_reformas/reforma_antes_6.jpg', 'img_reformas/reforma_despues_6.jpg', 'reportes_reformas/reporte_reforma_6.pdf'),
(9, 9, 1, 6, 6, 5, 15780.00, 3, 'La reforma debe realizarse lo antes posible. El cliente dijo que mientras más pronto se realice, habrá un plus por tiempo.', '2024-06-04', '2024-06-20', 1, 'img_reformas/reforma_antes_9.jpg', 'img_reformas/reforma_despues_9.jpg', NULL),
(10, 4, NULL, 2, 6, 4, 50000.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(11, 7, NULL, 5, 1, 5, 45000.00, 2, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(12, 7, 0, 5, 1, 5, 45000.00, 2, NULL, NULL, NULL, 1, NULL, NULL, NULL),
(13, 11, NULL, 13, 1, 3, 27000.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Reseñas`
--

CREATE TABLE `Reseñas` (
  `id_reseña` int(11) NOT NULL,
  `usuario_reseña` int(11) NOT NULL,
  `proyecto_reseñado` int(11) NOT NULL,
  `comentario_reseña` text DEFAULT NULL,
  `puntuacion` tinyint(1) NOT NULL,
  `reseña_aprobada` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Reseñas`
--

INSERT INTO `Reseñas` (`id_reseña`, `usuario_reseña`, `proyecto_reseñado`, `comentario_reseña`, `puntuacion`, `reseña_aprobada`) VALUES
(1, 6, 1, '', 4, 1),
(2, 2, 3, 'La reforma ha quedado espectacular. ¡No puedo creer que hayan transformado mi cocina en tan poco tiempo y con un resultado espectacular!', 5, 1),
(3, 2, 6, '', 5, 1),
(4, 9, 9, 'Me ha encantado como ha quedado la reforma. Me hubiera gustado que hubiera estado todo más limpio, pero es increíble el resultado.', 4, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Rol`
--

CREATE TABLE `Rol` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Rol`
--

INSERT INTO `Rol` (`id_rol`, `nombre_rol`) VALUES
(1, 'Administrador'),
(2, 'Empleado'),
(3, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Rol_empleado`
--

CREATE TABLE `Rol_empleado` (
  `id_rol_empleado` tinyint(4) NOT NULL,
  `nombre_rol_empleado` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Rol_empleado`
--

INSERT INTO `Rol_empleado` (`id_rol_empleado`, `nombre_rol_empleado`) VALUES
(1, 'Albañil'),
(2, 'Alicatador'),
(3, 'Peón'),
(5, 'Carpintero'),
(6, 'Electricista'),
(7, 'Plomero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Tipo_proyecto`
--

CREATE TABLE `Tipo_proyecto` (
  `id_tipo_proyecto` int(11) NOT NULL,
  `nombre_proyecto` varchar(60) NOT NULL,
  `calculo_proyecto` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Tipo_proyecto`
--

INSERT INTO `Tipo_proyecto` (`id_tipo_proyecto`, `nombre_proyecto`, `calculo_proyecto`) VALUES
(1, 'Reforma integral', 30),
(2, 'Reforma de cocina', 24),
(3, 'Reforma de baño', 22),
(4, 'Reforma de terraza/balcón', 20),
(5, 'Reforma de habitación', 18),
(6, 'Reforma de interiores', 15),
(7, 'Reforma de exteriores', 27);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuarios`
--

CREATE TABLE `Usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `dni_usuario` varchar(9) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `num_tlf` int(9) DEFAULT NULL,
  `tipo_usuario` int(11) NOT NULL,
  `cuenta_activa` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Usuarios`
--

INSERT INTO `Usuarios` (`id_usuario`, `nombre_usuario`, `dni_usuario`, `email`, `password`, `num_tlf`, `tipo_usuario`, `cuenta_activa`) VALUES
(1, 'Administrador', NULL, 'admin@example.com', '$2a$12$xh7yvLTmPsPi3B01tWSxq.kzQSc4St3JUndfvmajBMiDM53P1eN4e', NULL, 1, 1),
(2, 'Marta_V', '10000002C', 'cliente02@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000002, 3, 1),
(3, 'Carlos_R', '10000003D', 'cliente03@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000003, 3, 1),
(4, 'Lucia_P', '10000004E', 'cliente04@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000004, 3, 1),
(5, 'Sergio_M', '10000005F', 'cliente05@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000005, 3, 1),
(6, 'Elena_G', '10000006G', 'cliente06@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000006, 3, 1),
(7, 'Pablo_T', '10000007H', 'cliente07@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000007, 3, 1),
(8, 'Irene_L', '10000008J', 'cliente08@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000008, 3, 1),
(9, 'Hugo_D', '10000009K', 'cliente09@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000009, 3, 1),
(10, 'Noelia_S', '10000010L', 'cliente10@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000010, 3, 1),
(11, 'Alberto_C', '10000011M', 'cliente11@example.com', '$2y$12$pM8kjqxBLe12RFTgsJnVcOAOi/xKV8YCI0uAj19cu0F0.z90Ev8x6', 600000011, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Zonas_Valencia`
--

CREATE TABLE `Zonas_Valencia` (
  `id_zona` int(11) NOT NULL,
  `nombre_zona` varchar(40) NOT NULL,
  `calculo_zona` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `Zonas_Valencia`
--

INSERT INTO `Zonas_Valencia` (`id_zona`, `nombre_zona`, `calculo_zona`) VALUES
(1, 'Ciutat Vella', 25),
(2, 'L\'Eixample', 27),
(3, 'Extramurs', 29),
(4, 'La Saidia', 31),
(5, 'El Pla del Real', 33),
(6, 'Campanar', 35),
(7, 'L\'Olivereta', 37),
(8, 'Patraix', 39),
(9, 'Quatre Carreres', 41),
(10, 'Benicalap', 43),
(11, 'Benimaclet', 45),
(12, 'Algirós', 47),
(13, 'Poblats Marítims', 50);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Documentos_favoritos`
--
ALTER TABLE `Documentos_favoritos`
  ADD PRIMARY KEY (`id_documento_reforma`),
  ADD KEY `id_usuario_documento` (`id_usuario_documento`),
  ADD KEY `id_reforma_documento` (`id_reforma_documento`);

--
-- Indices de la tabla `Empleados`
--
ALTER TABLE `Empleados`
  ADD PRIMARY KEY (`id_empleado`),
  ADD KEY `tipo_empleado` (`tipo_empleado`),
  ADD KEY `supervisor_empleado` (`supervisor_empleado`),
  ADD KEY `tipo_usuario_global` (`tipo_usuario_global`);

--
-- Indices de la tabla `FAQ`
--
ALTER TABLE `FAQ`
  ADD PRIMARY KEY (`id_faq`);

--
-- Indices de la tabla `Jefes`
--
ALTER TABLE `Jefes`
  ADD PRIMARY KEY (`id_jefe`);

--
-- Indices de la tabla `Metros_reforma`
--
ALTER TABLE `Metros_reforma`
  ADD PRIMARY KEY (`id_metros`);

--
-- Indices de la tabla `Proyecto_reforma`
--
ALTER TABLE `Proyecto_reforma`
  ADD PRIMARY KEY (`id_reforma`),
  ADD KEY `zona_reforma` (`zona_reforma`),
  ADD KEY `tipo_reforma` (`tipo_reforma`),
  ADD KEY `Proyecto_reforma_ibfk_4` (`jefe_seleccionado`),
  ADD KEY `usuario_solicitante` (`usuario_solicitante`),
  ADD KEY `metros_reforma` (`metros_aprox_reforma`);

--
-- Indices de la tabla `Reseñas`
--
ALTER TABLE `Reseñas`
  ADD PRIMARY KEY (`id_reseña`),
  ADD KEY `usuario_reseña` (`usuario_reseña`),
  ADD KEY `proyecto_reseñado` (`proyecto_reseñado`);

--
-- Indices de la tabla `Rol`
--
ALTER TABLE `Rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `Rol_empleado`
--
ALTER TABLE `Rol_empleado`
  ADD PRIMARY KEY (`id_rol_empleado`);

--
-- Indices de la tabla `Tipo_proyecto`
--
ALTER TABLE `Tipo_proyecto`
  ADD PRIMARY KEY (`id_tipo_proyecto`);

--
-- Indices de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `tipo_usuario` (`tipo_usuario`);

--
-- Indices de la tabla `Zonas_Valencia`
--
ALTER TABLE `Zonas_Valencia`
  ADD PRIMARY KEY (`id_zona`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Documentos_favoritos`
--
ALTER TABLE `Documentos_favoritos`
  MODIFY `id_documento_reforma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `Empleados`
--
ALTER TABLE `Empleados`
  MODIFY `id_empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `FAQ`
--
ALTER TABLE `FAQ`
  MODIFY `id_faq` tinyint(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Jefes`
--
ALTER TABLE `Jefes`
  MODIFY `id_jefe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `Metros_reforma`
--
ALTER TABLE `Metros_reforma`
  MODIFY `id_metros` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `Proyecto_reforma`
--
ALTER TABLE `Proyecto_reforma`
  MODIFY `id_reforma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `Reseñas`
--
ALTER TABLE `Reseñas`
  MODIFY `id_reseña` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `Rol`
--
ALTER TABLE `Rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `Rol_empleado`
--
ALTER TABLE `Rol_empleado`
  MODIFY `id_rol_empleado` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Tipo_proyecto`
--
ALTER TABLE `Tipo_proyecto`
  MODIFY `id_tipo_proyecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `Zonas_Valencia`
--
ALTER TABLE `Zonas_Valencia`
  MODIFY `id_zona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Documentos_favoritos`
--
ALTER TABLE `Documentos_favoritos`
  ADD CONSTRAINT `Documentos_favoritos_ibfk_1` FOREIGN KEY (`id_usuario_documento`) REFERENCES `Usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Documentos_favoritos_ibfk_2` FOREIGN KEY (`id_reforma_documento`) REFERENCES `Proyecto_reforma` (`id_reforma`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `Empleados`
--
ALTER TABLE `Empleados`
  ADD CONSTRAINT `Empleados_ibfk_1` FOREIGN KEY (`tipo_empleado`) REFERENCES `Rol_empleado` (`id_rol_empleado`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Empleados_ibfk_2` FOREIGN KEY (`supervisor_empleado`) REFERENCES `Jefes` (`id_jefe`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Empleados_ibfk_3` FOREIGN KEY (`tipo_usuario_global`) REFERENCES `Rol` (`id_rol`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `Proyecto_reforma`
--
ALTER TABLE `Proyecto_reforma`
  ADD CONSTRAINT `Proyecto_reforma_ibfk_1` FOREIGN KEY (`zona_reforma`) REFERENCES `Zonas_Valencia` (`id_zona`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Proyecto_reforma_ibfk_2` FOREIGN KEY (`tipo_reforma`) REFERENCES `Tipo_proyecto` (`id_tipo_proyecto`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Proyecto_reforma_ibfk_4` FOREIGN KEY (`jefe_seleccionado`) REFERENCES `Jefes` (`id_jefe`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Proyecto_reforma_ibfk_5` FOREIGN KEY (`usuario_solicitante`) REFERENCES `Usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Proyecto_reforma_ibfk_6` FOREIGN KEY (`metros_aprox_reforma`) REFERENCES `Metros_reforma` (`id_metros`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `Reseñas`
--
ALTER TABLE `Reseñas`
  ADD CONSTRAINT `Reseñas_ibfk_1` FOREIGN KEY (`usuario_reseña`) REFERENCES `Usuarios` (`id_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Reseñas_ibfk_2` FOREIGN KEY (`proyecto_reseñado`) REFERENCES `Proyecto_reforma` (`id_reforma`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD CONSTRAINT `Usuarios_ibfk_1` FOREIGN KEY (`tipo_usuario`) REFERENCES `Rol` (`id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
