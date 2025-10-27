<?php

error_log("index.php started");
require_once __DIR__ . '/vendor/autoload.php';
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
$loader = new FilesystemLoader(__DIR__ . '/../app/templates');
$twig = new Environment($loader, [
    'cache' => false, // Disable cache for development
    'debug' => true,
]);

// Include models and controllers
require_once __DIR__ . '/../app/Controllers/BaseController.php';
require_once __DIR__ . '/../app/Models/User.php';
require_once __DIR__ . '/../app/Models/Ticket.php';
require_once __DIR__ . '/../app/Controllers/AuthController.php';
require_once __DIR__ . '/../app/Controllers/TicketController.php';
require_once __DIR__ . '/../app/Controllers/DashboardController.php';

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

    if (!method_exists($controller, $action)) {
        error_log("Action $action does not exist in controller $controllerClass");
        throw new Exception("Action not found: $action");
    }

    $response = call_user_func_array([$controller, $action], [$parameters]);
    error_log("Response generated successfully");

} catch (Exception $e) {
    error_log("Exception caught: " . $e->getMessage());
    $response = new Response('Not Found', 404);
}

// Send response
$response->send();