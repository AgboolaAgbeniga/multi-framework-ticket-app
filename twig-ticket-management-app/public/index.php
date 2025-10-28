<?php

ini_set('error_log', __DIR__ . '/../php_errors.log');
error_log("index.php started");
// Determine project root whether this file lives in /public or was moved to the web root
$rootDir = __DIR__;
if (!is_dir($rootDir . '/vendor') && is_dir(dirname(__DIR__) . '/vendor')) {
    $rootDir = dirname(__DIR__);
}

require_once $rootDir . '/vendor/autoload.php';
error_log("Autoloader loaded");

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

// Initialize Twig
$loader = new FilesystemLoader($rootDir . '/app/templates');
$twig = new Environment($loader, [
    'cache' => false, // Disable cache for development
    'debug' => true,
]);

// Include models and controllers
require_once $rootDir . '/app/Models/User.php';
require_once $rootDir . '/app/Models/Ticket.php';
require_once $rootDir . '/app/Controllers/AuthController.php';
require_once $rootDir . '/app/Controllers/TicketController.php';
require_once $rootDir . '/app/Controllers/DashboardController.php';

// Initialize request
$request = Request::createFromGlobals();

// Initialize session
$session = new Session();
$session->start();
$request->setSession($session);

// Routes
$routes = new RouteCollection();

// Public routes
$routes->add('home', new Route('/', ['controller' => 'DashboardController', 'action' => 'landing']));
$routes->add('login', new Route('/login', ['controller' => 'AuthController', 'action' => 'login']));
$routes->add('register', new Route('/register', ['controller' => 'AuthController', 'action' => 'register']));

// Protected routes
$routes->add('dashboard', new Route('/dashboard', ['controller' => 'DashboardController', 'action' => 'index']));
$routes->add('tickets', new Route('/tickets', ['controller' => 'TicketController', 'action' => 'index']));
$routes->add('tickets_create', new Route('/tickets/create', ['controller' => 'TicketController', 'action' => 'create']));
$routes->add('tickets_edit', new Route('/tickets/{id}/edit', ['controller' => 'TicketController', 'action' => 'edit']));
$routes->add('tickets_delete', new Route('/tickets/{id}/delete', ['controller' => 'TicketController', 'action' => 'delete']));
$routes->add('logout', new Route('/logout', ['controller' => 'AuthController', 'action' => 'logout']));

// Match route
$context = new RequestContext();
$context->fromRequest($request);
$matcher = new UrlMatcher($routes, $context);

try {
    error_log("About to match route for path: " . $request->getPathInfo());
    error_log("Request Path: " . $request->getPathInfo());
    $parameters = $matcher->match($request->getPathInfo());
    error_log("Matched parameters: " . json_encode($parameters));

    $controllerName = $parameters['controller'];
    $action = $parameters['action'];
    error_log("Controller: $controllerName, Action: $action");

    // Remove controller and action from parameters
    unset($parameters['controller'], $parameters['_route']);

    // Instantiate controller and call action
    $controllerClass = "App\\Controllers\\$controllerName";
    error_log("Instantiating controller: $controllerClass");
    if (!class_exists($controllerClass)) {
        error_log("Controller class $controllerClass does not exist");
        throw new Exception("Controller class not found: $controllerClass");
    }
    $controller = new $controllerClass($twig, $request);
    error_log("Controller instantiated successfully");

    if (!method_exists($controller, $action)) {
        error_log("Action $action does not exist in controller $controllerClass");
        throw new Exception("Action not found: $action");
    }
    error_log("Calling action: $action");

    $response = call_user_func_array([$controller, $action], [$parameters]);
    error_log("Response generated successfully, type: " . get_class($response));

} catch (Symfony\Component\Routing\Exception\ResourceNotFoundException $e) {
    error_log("Route not found: " . $e->getMessage());
    $response = new Response('Not Found', 404);
} catch (Exception $e) {
    error_log("Exception caught: " . $e->getMessage());
    error_log("Exception trace: " . $e->getTraceAsString());
    $response = new Response('Internal Server Error', 500);
}

// Send response
$response->send();