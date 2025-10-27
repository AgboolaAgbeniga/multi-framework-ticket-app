<?php

namespace App\Controllers;

use App\Models\Ticket;

class DashboardController extends BaseController
{
    public function landing($params = [])
    {
        error_log("DashboardController::landing called");
        $isAuth = $this->isAuthenticated();
        error_log("User authenticated: " . ($isAuth ? 'yes' : 'no'));
        if ($isAuth) {
            error_log("Redirecting authenticated user to /dashboard");
            return $this->redirect('/dashboard');
        }

        error_log("Rendering landing.html.twig");
        return $this->render('landing.html.twig');
    }

    public function index($params = [])
    {
        $authCheck = $this->requireAuth();
        if ($authCheck) return $authCheck;

        $user = $this->getCurrentUser();
        $stats = Ticket::getStatsForUser($user['id']);

        // Build a natural-language summary of status counts for the Status Overview
        $statusSummary = '';
        if ($stats['total'] > 0) {
            $parts = [];
            if ($stats['open'] > 0) $parts[] = $stats['open'] . ' open ' . ($stats['open'] === 1 ? 'ticket' : 'tickets');
            if ($stats['inProgress'] > 0) $parts[] = $stats['inProgress'] . ' in progress';
            if ($stats['closed'] > 0) $parts[] = $stats['closed'] . ' resolved ' . ($stats['closed'] === 1 ? 'ticket' : 'tickets');
            if (count($parts) === 1) {
                $statusSummary = $parts[0];
            } elseif (count($parts) === 2) {
                $statusSummary = $parts[0] . ' and ' . $parts[1];
            } else {
                $statusSummary = implode(', ', array_slice($parts, 0, -1)) . ', and ' . end($parts);
            }
        }

        return $this->render('dashboard/index.html.twig', [
            'stats' => $stats,
            'statusSummary' => $statusSummary
        ]);
    }
}