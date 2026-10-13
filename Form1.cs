using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;

namespace IntegrativeProjectBS
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            this.MinimumSize = SizeFromClientSize(new Size(1024, 680));
        }

        private async void Form1_Load(object sender, EventArgs e)
        {
            // inicializar webview2
            await webView21.EnsureCoreWebView2Async(null);

            // exponer la clase BridgeService a JS como 'backend'
            webView21.CoreWebView2.AddHostObjectToScript("backend", new BridgeService());

            // cargar index.html desde la carpeta web
            string htmlPath = Path.Combine(Application.StartupPath, "web", "index.html");

            if (File.Exists(htmlPath))
            {
                webView21.CoreWebView2.Navigate(new Uri(htmlPath).AbsoluteUri);
            }
            else
            {
                MessageBox.Show("No se encontro index.html en: " + htmlPath);
            }
        }
    }

    // clase puente entre JS y C# via COM, necesita ComVisible
    [ClassInterface(ClassInterfaceType.AutoDual)]
    [ComVisible(true)]
    public class BridgeService
    {
        private static readonly JavaScriptSerializer Json = new JavaScriptSerializer();

        // metodo de prueba para verificar comunicacion JS <-> C#
        public string Saludar(string mensaje)
        {
            MessageBox.Show("Mensaje recibido desde JS: " + mensaje, "C# WinForms");
            return "Hola desde C#! Procese tu texto: " + mensaje;
        }

        // login: valida credenciales y devuelve JSON con resultado
        // por ahora solo acepta admin / admin123 (stub de prueba)
        public string Login(string userOrEmail, string password, string rol, bool rememberMe)
        {
            // TODO: validar contra bd real con hash de password
            bool ok = string.Equals((userOrEmail ?? "").Trim(), "admin", StringComparison.OrdinalIgnoreCase)
                      && password == "admin123";

            var respuesta = new Dictionary<string, object>
            {
                { "ok", ok },
                { "usuario", ok ? "admin" : null },
                { "rol", ok ? rol : null },
                { "mensaje", ok ? null : "Usuario o contrasena incorrectos." }
            };
            return Json.Serialize(respuesta);
        }

        // TODO: implementar registro cuando exista el backend con bd
        // public string Registrar(string datosJson) { ... }
    }
}
