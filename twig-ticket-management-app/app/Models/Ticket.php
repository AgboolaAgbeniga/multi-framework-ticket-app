<?php

namespace App\Models;

class Ticket
{
    private static $dataFile = __DIR__ . '/../../data/tickets.json';

    public static function getAll()
    {
        if (!file_exists(self::$dataFile)) {
            return [];
        }
        $data = json_decode(file_get_contents(self::$dataFile), true);
        return $data ?: [];
    }

    public static function getAllForUser($userId)
    {
        $tickets = self::getAll();
        return array_filter($tickets, function($ticket) use ($userId) {
            return $ticket['userId'] == $userId;
        });
    }

    public static function findById($id)
    {
        $tickets = self::getAll();
        foreach ($tickets as $ticket) {
            if ($ticket['id'] == $id) {
                return $ticket;
            }
        }
        return null;
    }

    public static function findByIdForUser($id, $userId)
    {
        $ticket = self::findById($id);
        return ($ticket && $ticket['userId'] == $userId) ? $ticket : null;
    }

    public static function create($data)
    {
        $tickets = self::getAll();
        $data['id'] = uniqid();
        $data['createdAt'] = date('c');
        $data['updatedAt'] = date('c');
        $tickets[] = $data;
        file_put_contents(self::$dataFile, json_encode($tickets, JSON_PRETTY_PRINT));
        return $data;
    }

    public static function update($id, $data)
    {
        $tickets = self::getAll();
        foreach ($tickets as &$ticket) {
            if ($ticket['id'] == $id) {
                $ticket = array_merge($ticket, $data);
                $ticket['updatedAt'] = date('c');
                file_put_contents(self::$dataFile, json_encode($tickets, JSON_PRETTY_PRINT));
                return $ticket;
            }
        }
        return null;
    }

    public static function delete($id)
    {
        $tickets = self::getAll();
        $tickets = array_filter($tickets, function($ticket) use ($id) {
            return $ticket['id'] != $id;
        });
        file_put_contents(self::$dataFile, json_encode($tickets, JSON_PRETTY_PRINT));
        return true;
    }

    public static function getStatsForUser($userId)
    {
        $tickets = self::getAllForUser($userId);
        $stats = [
            'total' => count($tickets),
            'open' => 0,
            'inProgress' => 0,
            'closed' => 0
        ];

        foreach ($tickets as $ticket) {
            switch ($ticket['status']) {
                case 'open':
                    $stats['open']++;
                    break;
                case 'in_progress':
                    $stats['inProgress']++;
                    break;
                case 'closed':
                    $stats['closed']++;
                    break;
            }
        }

        return $stats;
    }
}