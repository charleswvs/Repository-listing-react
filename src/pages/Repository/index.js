import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: {},
      issues: [],
      loading: true,
      filter: 'open',
      page: 1,
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { filter } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    // wait all promises finish (both of them are requested at the same time) before continue
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filter,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  async filterIssues(filter) {
    const { match } = this.props;
    const { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);
    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filter,
        page,
      },
    });

    this.setState({
      filter,
      issues: issues.data,
      loading: false,
    });
  }

  async changePage(pageNumber) {
    const { match } = this.props;
    const { filter } = this.state;

    const repoName = decodeURIComponent(match.params.repository);
    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filter,
        page: pageNumber,
      },
    });

    this.setState({
      issues: issues.data,
      page: pageNumber,
    });
  }

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositorios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
          <div>
            <button type="button" onClick={() => this.filterIssues('all')}>
              Todos
            </button>
            <button type="button" onClick={() => this.filterIssues('closed')}>
              Fechados
            </button>
            <button type="button" onClick={() => this.filterIssues('open')}>
              Abertos
            </button>
          </div>
        </Owner>

        <IssueList>
          <div>
            {page !== 1 ? (
              <button
                type="button"
                className="btn__prev"
                onClick={() => this.changePage(page - 1)}
              >
                Página {page - 1}
              </button>
            ) : null}
            <button type="button" onClick={() => this.changePage(page + 1)}>
              Página {page + 1}
            </button>
          </div>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
