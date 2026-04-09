<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Image;

class ImageController extends Controller
{
    // Загрузка изображения
    public function store(Request $request, $id)
    {
        if (!$request->hasFile('image')) {
            return response()->json(['error' => 'No file'], 400);
        }

        $path = $request->file('image')->store('cards', 'public');

        return Image::create([
            'path' => $path,
            'card_id' => $id
        ]);
    }

    // Удаление изображения
    public function destroy($id)
    {
        Image::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }
}