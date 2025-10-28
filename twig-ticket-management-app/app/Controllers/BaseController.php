<?php

namespace App\Controllers;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Twig\Environment;

abstract class BaseController
{
    protected $twig;
    protected $request;
    protected $session;

    public function __construct(Environment $twig, Request $request)
    {
        $this->twig = $twig;
        $this->request = $request;
        $this->session = $request->getSession();

        if (!$this->session) {
            $this->session = new Session();
            $this->session->start();
            $request->setSession($this->session);
        }
    }

    protected function render($template, $data = [])
    {
        $data['session'] = $this->session->get('user');
        $data['flash_messages'] = $this->getFlashMessages();
        return new Response($this->twig->render($template, $data));
    }

    protected function redirect($url)
    {
        return new RedirectResponse($url);
    }

    protected function isAuthenticated()
    {
        $isAuth = $this->session->has('user');
        error_log("isAuthenticated check: " . ($isAuth ? 'true' : 'false'));
        if ($isAuth) {
            error_log("User session data: " . json_encode($this->session->get('user')));
        }
        return $isAuth;
    }

    protected function requireAuth()
    {
        if (!$this->isAuthenticated()) {
            return $this->redirect('/login');
        }
        return null;
    }

    protected function getCurrentUser()
    {
        return $this->session->get('user');
    }

    protected function addFlashMessage($type, $message)
    {
        $messages = $this->session->get('flash_messages', []);
        $messages[] = ['type' => $type, 'message' => $message];
        $this->session->set('flash_messages', $messages);
    }

    protected function getFlashMessages()
    {
        $messages = $this->session->get('flash_messages', []);
        $this->session->remove('flash_messages');
        return $messages;
    }
}