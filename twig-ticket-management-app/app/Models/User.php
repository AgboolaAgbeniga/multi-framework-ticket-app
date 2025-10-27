<?php

namespace App\Models;

class User
{
    private static $dataFile = __DIR__ . '/../../data/users.json';

    public static function getAll()
    {
        if (!file_exists(self::$dataFile)) {
            return [];
        }
        $data = json_decode(file_get_contents(self::$dataFile), true);
        return $data ?: [];
    }

    public static function findByEmail($email)
    {
        $users = self::getAll();
        foreach ($users as $user) {
            if ($user['email'] === $email) {
                return $user;
            }
        }
        return null;
    }

    public static function findById($id)
    {
        $users = self::getAll();
        foreach ($users as $user) {
            if ($user['id'] == $id) {
                return $user;
            }
        }
        return null;
    }

    public static function create($data)
    {
        $users = self::getAll();
        $data['id'] = uniqid();
        $users[] = $data;
        file_put_contents(self::$dataFile, json_encode($users, JSON_PRETTY_PRINT));
        return $data;
    }

    public static function update($id, $data)
    {
        $users = self::getAll();
        foreach ($users as &$user) {
            if ($user['id'] == $id) {
                $user = array_merge($user, $data);
                file_put_contents(self::$dataFile, json_encode($users, JSON_PRETTY_PRINT));
                return $user;
            }
        }
        return null;
    }

    public static function delete($id)
    {
        $users = self::getAll();
        $users = array_filter($users, function($user) use ($id) {
            return $user['id'] != $id;
        });
        file_put_contents(self::$dataFile, json_encode($users, JSON_PRETTY_PRINT));
        return true;
    }
}