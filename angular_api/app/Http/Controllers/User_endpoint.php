<?php

namespace App\Http\Controllers;

header("Access-Control-Allow-Origin: *");

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Support\Facades\Input;

class User_endpoint extends Controller {

  public function getData() {
    
    $sort_field = Input::get('sortField');
    $sort_order = Input::get('sortOrder');
    $rec_per_page = Input::get('recPerPage');
    $current_page = Input::get('currentPage');
    $limitFrom = ($current_page - 1) * $rec_per_page;
    $search_fields_or_search_text = Input::get('searchFields');

    if (isset($limitFrom) && isset($rec_per_page) && isset($search_fields_or_search_text)) {
      if (is_array($search_fields_or_search_text)) {
        $usertotal_search_query = User::query();
        $userdata_search_query = User::query();
        foreach ($search_fields_or_search_text as $search_field => $search_value) {
          $totalUsers = $usertotal_search_query->where($search_field, 'LIKE', '%' . $search_value . '%');
          $users = $userdata_search_query->where($search_field, 'LIKE', '%' . $search_value . '%');
        }
        $totalUsers = $usertotal_search_query->count();

        $users = $userdata_search_query->skip($limitFrom)
                ->take($rec_per_page)
                ->get();
      } else {
        $user_fields = \Schema::getColumnListing('users');
        $usertotal_search_query = User::query();
        $userdata_search_query = User::query();
        foreach($user_fields as $user_field) {
          $totalUsers = $usertotal_search_query -> orWhere($user_field, 'LIKE', '%' . $search_fields_or_search_text . '%');
          $users = $userdata_search_query -> orWhere($user_field, 'LIKE', '%'. $search_fields_or_search_text . '%');
        }
        $totalUsers = $usertotal_search_query -> count();
        $users = $userdata_search_query -> skip($limitFrom)
        -> take($rec_per_page)
        -> get(); 
      }
    } else if (isset($limitFrom) && isset($rec_per_page) && isset($sort_field) && isset($sort_order)) {
      $totalUsers = User::count();
      $users = User::orderBy($sort_field, $sort_order)
              ->skip($limitFrom)
              ->take($rec_per_page)
              ->get();
    } else if (isset($limitFrom) && isset($rec_per_page)) {
      $totalUsers = User::count();
      $users = User::skip($limitFrom)
              ->take($rec_per_page)
              ->get();
    } else {
      $totalUsers = User::count();
      $users = User::all();
    }
    return ['userCount' => $totalUsers, 'users' => $users];
  }
}
