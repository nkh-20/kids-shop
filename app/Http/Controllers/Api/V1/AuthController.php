<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private AuthService $authService)
    {
    }

    public function register(RegisterRequest $request)
    {
        $user = $this->authService->register($request->validated());

        return $this->success(
            new UserResource($user),
            'Registration successful.',
            201
        );
    }

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());

        return $this->success([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Login successful.');
    }

    public function logout()
    {
        $this->authService->logout(request()->user());

        return $this->success(null, 'Logged out successfully.');
    }

    public function user()
    {
        return $this->success(
            new UserResource(request()->user()),
            'User retrieved successfully.'
        );
    }
}
