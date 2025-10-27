<?php

namespace App\Controllers;

use App\Models\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends BaseController
{
    public function login($params = [])
    {
        if ($this->isAuthenticated()) {
            return $this->redirect('/dashboard');
        }

        if ($this->request->isMethod('POST')) {
            return $this->handleLogin();
        }

        return $this->render('auth/login.html.twig');
    }

    public function register($params = [])
    {
        if ($this->isAuthenticated()) {
            return $this->redirect('/dashboard');
        }

        if ($this->request->isMethod('POST')) {
            return $this->handleRegister();
        }

        return $this->render('auth/register.html.twig');
    }

    public function logout($params = [])
    {
        $this->session->clear();
        $this->addFlashMessage('success', 'You have been logged out successfully.');
        return $this->redirect('/');
    }

    private function handleLogin()
    {
        $email = $this->request->request->get('email');
        $password = $this->request->request->get('password');

        $errors = [];

        if (empty($email)) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email is invalid';
        }

        if (empty($password)) {
            $errors['password'] = 'Password is required';
        } elseif (strlen($password) < 6) {
            $errors['password'] = 'Password must be at least 6 characters';
        }

        if (!empty($errors)) {
            return $this->render('auth/login.html.twig', [
                'errors' => $errors,
                'email' => $email
            ]);
        }

        $user = User::findByEmail($email);

        if (!$user || $user['password'] !== $password) {
            $this->addFlashMessage('error', 'Invalid email or password');
            return $this->render('auth/login.html.twig', [
                'email' => $email
            ]);
        }

        // Set session
        $this->session->set('user', [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name']
        ]);

        $this->addFlashMessage('success', 'Welcome back, ' . $user['name'] . '!');
        return $this->redirect('/dashboard');
    }

    private function handleRegister()
    {
        $name = $this->request->request->get('name');
        $email = $this->request->request->get('email');
        $password = $this->request->request->get('password');
        $confirmPassword = $this->request->request->get('confirm_password');

        $errors = [];

        if (empty($name)) {
            $errors['name'] = 'Name is required';
        } elseif (strlen($name) < 2) {
            $errors['name'] = 'Name must be at least 2 characters';
        }

        if (empty($email)) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email is invalid';
        } elseif (User::findByEmail($email)) {
            $errors['email'] = 'Email already exists';
        }

        if (empty($password)) {
            $errors['password'] = 'Password is required';
        } elseif (strlen($password) < 6) {
            $errors['password'] = 'Password must be at least 6 characters';
        }

        if (empty($confirmPassword)) {
            $errors['confirm_password'] = 'Please confirm your password';
        } elseif ($password !== $confirmPassword) {
            $errors['confirm_password'] = 'Passwords do not match';
        }

        if (!empty($errors)) {
            return $this->render('auth/register.html.twig', [
                'errors' => $errors,
                'name' => $name,
                'email' => $email
            ]);
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password
        ]);

        // Set session
        $this->session->set('user', [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name']
        ]);

        $this->addFlashMessage('success', 'Account created successfully! Welcome, ' . $user['name'] . '!');
        return $this->redirect('/dashboard');
    }
}