<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Card;

class CardController extends Controller
{
    // создание карточки
    public function store(Request $request)
    {
        return Card::create([
            'title' => $request->title,
            'description' => $request->description,
            'column_id' => $request->column_id
        ]);
    }

    // обновление карточки
    public function update(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $card->update($request->only('title', 'description', 'column_id'));

        return $card;
    }

    // удаление
    public function destroy($id)
    {
        Card::findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }

    // смена порядка карточек
    public function reorder(Request $request)
    {
        $cards = $request->cards;

        foreach ($cards as $index => $cardData) {
            \App\Models\Card::where('id', $cardData['id'])
                ->update([
                    'column_id' => $cardData['column_id'],
                    'order' => $index
                ]);
        }

        return response()->json(['success' => true]);
    }
}