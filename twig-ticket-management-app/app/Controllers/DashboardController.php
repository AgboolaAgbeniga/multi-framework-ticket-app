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

        return $this->render('dashboard/index.html.twig', [
            'stats' => $stats
        ]);
    }
}