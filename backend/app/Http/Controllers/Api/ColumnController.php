<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Column;

class ColumnController extends Controller
{
    // создание
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

    // обновление
    public function update(Request $request, $id)
    {
        $column = Column::findOrFail($id);

        $column->update($request->only('title'));

        return $column;
    }

    // удаление
    public function destroy($id)
    {
        Column::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }
}