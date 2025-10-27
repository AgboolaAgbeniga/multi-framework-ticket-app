<?php

namespace App\Controllers;

use App\Models\Ticket;

class TicketController extends BaseController
{
    public function index($params = [])
    {
        $authCheck = $this->requireAuth();
        if ($authCheck) return $authCheck;

        $user = $this->getCurrentUser();
        $status = $this->request->query->get('status', 'all');

        $tickets = Ticket::getAllForUser($user['id']);

        if ($status !== 'all') {
            $tickets = array_filter($tickets, function($ticket) use ($status) {
                return $ticket['status'] === $status;
            });
        }

        return $this->render('tickets/index.html.twig', [
            'tickets' => $tickets,
            'filter_status' => $status
        ]);
    }

    public function create($params = [])
    {
        $authCheck = $this->requireAuth();
        if ($authCheck) return $authCheck;

        if ($this->request->isMethod('POST')) {
            return $this->handleCreate();
        }

        return $this->render('tickets/create.html.twig');
    }

    public function edit($params = [])
    {
        $authCheck = $this->requireAuth();
        if ($authCheck) return $authCheck;

        $user = $this->getCurrentUser();
        $id = $params['id'] ?? null;

        $ticket = Ticket::findByIdForUser($id, $user['id']);
        if (!$ticket) {
            $this->addFlashMessage('error', 'Ticket not found');
            return $this->redirect('/tickets');
        }

        if ($this->request->isMethod('POST')) {
            return $this->handleUpdate($id);
        }

        return $this->render('tickets/edit.html.twig', [
            'ticket' => $ticket
        ]);
    }

    public function delete($params = [])
    {
        $authCheck = $this->requireAuth();
        if ($authCheck) return $authCheck;

        $user = $this->getCurrentUser();
        $id = $params['id'] ?? null;

        $ticket = Ticket::findByIdForUser($id, $user['id']);
        if (!$ticket) {
            $this->addFlashMessage('error', 'Ticket not found');
            return $this->redirect('/tickets');
        }

        Ticket::delete($id);
        $this->addFlashMessage('success', 'Ticket deleted successfully');
        return $this->redirect('/tickets');
    }

    private function handleCreate()
    {
        $user = $this->getCurrentUser();

        $title = trim($this->request->request->get('title'));
        $description = trim($this->request->request->get('description'));
        $status = $this->request->request->get('status');
        $priority = $this->request->request->get('priority');

        $errors = [];

        if (empty($title)) {
            $errors['title'] = 'Title is required';
        } elseif (strlen($title) < 3) {
            $errors['title'] = 'Title must be at least 3 characters';
        } elseif (strlen($title) > 100) {
            $errors['title'] = 'Title must not exceed 100 characters';
        }

        if (empty($status)) {
            $errors['status'] = 'Status is required';
        }

        if (!empty($errors)) {
            return $this->render('tickets/create.html.twig', [
                'errors' => $errors,
                'title' => $title,
                'description' => $description,
                'status' => $status,
                'priority' => $priority
            ]);
        }

        Ticket::create([
            'title' => $title,
            'description' => $description,
            'status' => $status,
            'priority' => $priority ?: 'medium',
            'userId' => $user['id']
        ]);

        $this->addFlashMessage('success', 'Ticket created successfully');
        return $this->redirect('/tickets');
    }

    private function handleUpdate($id)
    {
        $user = $this->getCurrentUser();

        $title = trim($this->request->request->get('title'));
        $description = trim($this->request->request->get('description'));
        $status = $this->request->request->get('status');
        $priority = $this->request->request->get('priority');

        $errors = [];

        if (empty($title)) {
            $errors['title'] = 'Title is required';
        } elseif (strlen($title) < 3) {
            $errors['title'] = 'Title must be at least 3 characters';
        } elseif (strlen($title) > 100) {
            $errors['title'] = 'Title must not exceed 100 characters';
        }

        if (empty($status)) {
            $errors['status'] = 'Status is required';
        }

        if (!empty($errors)) {
            $ticket = Ticket::findByIdForUser($id, $user['id']);
            return $this->render('tickets/edit.html.twig', [
                'ticket' => $ticket,
                'errors' => $errors,
                'title' => $title,
                'description' => $description,
                'status' => $status,
                'priority' => $priority
            ]);
        }

        Ticket::update($id, [
            'title' => $title,
            'description' => $description,
            'status' => $status,
            'priority' => $priority ?: 'medium'
        ]);

        $this->addFlashMessage('success', 'Ticket updated successfully');
        return $this->redirect('/tickets');
    }
}