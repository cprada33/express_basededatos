API REST con Base de Datos y Cache

La aplicación permite hacer operaciones básicas con productos: crearlos, verlos, editarlos y eliminarlos. Lo que hace especial a este proyecto es que cuando alguien pide información de productos, primero revisa si ya tiene esa información guardada en Redis, y si la tiene, la devuelve inmediatamente sin tener que ir a consultar la base de datos. Esto hace que todo sea mucho más rápido.

Cuando alguien crea un producto nuevo, se guarda en la base de datos SQLite usando Sequelize. Después de guardarlo, automáticamente borra toda la información que tenía guardada en cache para que la próxima vez que alguien pida los productos, obtenga la lista actualizada con el producto nuevo.

## Conclusiones

Desarrollar esta API me ayudó a entender cómo funciona el caching en aplicaciones reales. Al principio pensé que Redis era solo para hacer las cosas más rápidas, pero me di cuenta de que también hay que ser muy cuidadoso con la consistencia de los datos. Si no invalidas el cache correctamente, puedes terminar mostrando información vieja a los usuarios.

## Observaciones

Una limitación que identifiqué es que mi sistema de cache es bastante básico. En una aplicación real probablemente necesitarías estrategias más sofisticadas, como cache warming o invalidación selectiva más granular. También sería buena idea implementar métricas para medir qué tan efectivo está siendo el cache.
