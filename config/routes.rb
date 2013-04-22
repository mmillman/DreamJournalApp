DreamJournalApp::Application.routes.draw do
  root :to => 'dreams#index'

  resources :dreams
  resources :themes
end
