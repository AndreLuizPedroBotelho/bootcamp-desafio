import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import {
  Loading,
  Owner,
  IssueList,
  DivSelect,
  PageButtons,
  Clear,
} from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    state: 'open',
    page: 1,
    lastPage: false,
  };

  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    this.handleRepoSearch({ repoName });
  }

  handleRepoSearch = async params => {
    const { page } = this.state;

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${params.repoName}`),
      api.get(`/repos/${params.repoName}/issues`, {
        params: {
          state: params.state || 'open',
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      lastPage: !(issues.data.length === 5),
    });
  };

  handleChange = async e => {
    this.setState({ state: e.target.value, page: 1, loading: true });
    const { location } = this.props;

    const repoName = decodeURIComponent(
      location.pathname.replace('/repository/', '')
    );
    this.handleRepoSearch({ state: e.target.value, repoName });
  };

  handlePrev = async e => {
    const { location } = this.props;

    const repoName = decodeURIComponent(
      location.pathname.replace('/repository/', '')
    );

    const { page } = this.state;

    await this.setState({ page: page - 1, loading: true });

    this.handleRepoSearch({ repoName });
  };

  handleNext = async e => {
    const { location } = this.props;

    const repoName = decodeURIComponent(
      location.pathname.replace('/repository/', '')
    );

    const { page } = this.state;

    await this.setState({ page: page + 1, loading: true });

    this.handleRepoSearch({ repoName });
  };

  render() {
    const { repository, issues, loading, state, page, lastPage } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          <DivSelect>
            <select value={state} onChange={this.handleChange}>
              <option value="all">Todos</option>
              <option value="open">Aberto</option>
              <option value="closed">Fechado</option>
            </select>
          </DivSelect>
          <Clear />
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
        <PageButtons>
          <button
            type="button"
            disabled={page === 1}
            onClick={() => {
              this.handlePrev();
            }}
          >
            Anterior
          </button>

          <button
            type="button"
            disabled={lastPage}
            onClick={() => {
              this.handleNext();
            }}
          >
            Proximo
          </button>
        </PageButtons>
        <Clear />
      </Container>
    );
  }
}
