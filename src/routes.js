import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main/index';
import Repository from './pages/Repository/index';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        {/* o switch garante que apenas uma rota se chamada por vez */}
        <Route path="/" exact component={Main} />
        {/* se o exact não for infomado, o react irá mostrar a primeira rota que comece com "/", ou seja, nenhuma rota seria mostrada */}
        <Route path="/repository/:repository" component={Repository} />
      </Switch>
    </BrowserRouter>
  );
}
