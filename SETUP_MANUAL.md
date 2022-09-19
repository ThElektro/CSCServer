
# Manual de instalación del repositorio de CSCServer
Este manual explica como instalar las herramientas necesarias para poder editar el repositorio de la página web del CSC. Asume una instalación de Windows 10 limpia.

# VSCode
Necesitaremos el editor de código VSCode donde haremos los cambios en la página web. Para instalarlo usar el siguiente enlace: [Visual Studio Code - Code Editing. Redefined](https://code.visualstudio.com/)

# WSL
En primer lugar, será necesario instalar WSL en Windows 10. Esto es una característica de Windows que permite ejecutar un sistema linux. 

Ver [Install WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/install) para instalar.

En nuestro caso, ejecutaremos el siguiente comando para instalar WSL (powershell con permisos de administrador):  
`wsl --install`
Una vez instalado, podemos iniciar la sesión en WSL con el comando:  
`wsl`
La primera vez que lo abramos debería pedir un nombre de usuario y contraseña. Se puede poner los que se prefiera, pero es importante recordar la contraseña porque será necesaria para los siguientes comandos.

La primera vez que lo instalemos también deberemos crear el archivo `/etc/wsl.conf` con el siguiente contenido:
```
[automount]
enabled = true
options = "metadata"
mountFsTab = false
```
Solución extraída de https://askubuntu.com/questions/911804/ubuntu-for-windows-10-all-files-are-own-by-root-and-i-cannot-change-it

# Crear par de clave pública-privada
Para poder conectarse al servidor es necesario que creemos un par de claves en nuestra máquina. Esto se hace con el comando:  
`ssh-keygen -t ed25519 -C "CORREO"`
Sustituir *CORREO* con tu correo oficial.
Aceptar la localización predeterminada de la llave y poner una passphrase. Es muy importante recordar esta passphrase, ya que no se puede recuperar si se pierde. Sin embargo, si se perdiese, se puede contactar con el administrador del sistema para establecer un nuevo par de claves.

A continuación:
`cat ~/.ssh/id_ed25519.pub`
Copiar el resultado y enviarlo al administrador del sistema para que lo registre en el servidor.

# Descargar dependencias
Ejecutar los siguientes comandos:
```bash
sudo apt update
sudo apt upgrade
sudo apt install nodejs
```
# Clonar el repositorio remoto
Se copiará todo el código de la página web en una carpeta local para que puedas modificarlo.
Ejecutar este comando en la carpeta donde queramos tener el código. Esto creará una nueva carpeta `CSCServer` que tendrá en su interior el código.
`git clone git@csc.ctb.upm.es:/home/git/www/.git CSCServer`
Ejecutar también los siguientes comandos:
```bash
cd CSCServer
git fetch
git checkout -b master origin/master
git switch master
```

Comprobar que `git branch` nos da la siguiente salida:
```
* master
release
```

# Abrir repositorio local en VSCode
Abrir la carpeta donde hemos descargado el cógido con VSCode. 
A continuación leer la documentación sobre como modificar el código en el archivo README.md. Esto es un archivo markdown, para verlo bonito le damos al icono de un libro con lupa que aparece en la parte superior derecha del editor.

Para abrir la consola, pulsar `Ctrl+Shift+ñ`. Ejecutaremos `wsl` para cambiar a linux.
A continuación:
```bash
cd WebServer
npm install
```

Ya podemos volver a CSCServer con `cd CSCServer` ejecutar el script build.py de la forma descrita en la documentación (`python3 build.py`).
