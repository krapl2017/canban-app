<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;

class BoardController extends Controller
{
    // получение всех досок пользователя
    public function index(Request $request)
    {
        return Board::where('user_name', $request->user_name)->get();
    }

    // создание доски
    public function store(Request $request)
    {
        return Board::create([
            'title' => $request->title,
            'user_name' => $request->user_name
        ]);
    }

    // получение всех досок со всем содержимым
    public function show($id)
    {
        return Board::with(['columns.cards' => function ($q) {
            $q->orderBy('order');
        }, 'columns.cards.images'])->findOrFail($id);
    }

    // обновление доски
    public function update(Request $request, $id)
    {
        $board = Board::findOrFail($id);

        $board->update($request->only('title'));

        return $board;
    }

    // удаление доски
    public function destroy($id)
    {
        Board::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }

    
}