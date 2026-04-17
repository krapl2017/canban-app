<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Column;

class ColumnController extends Controller
{
    // Создать колонку
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string'
        ]);
        return Column::create([
            'title' => $request->title,
            'board_id' => $request->board_id
        ]);
    }

    // Обновить
    public function update(Request $request, $id)
    {
        $column = Column::findOrFail($id);

        $column->update($request->only('title'));

        return $column;
    }

    // Удалить
    public function destroy($id)
    {
        Column::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }
}