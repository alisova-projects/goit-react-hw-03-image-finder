import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from '../Searchbar';
import apiService from '../../ApiService';
import ImageGallery from '../ImageGallery';
import OnLoadMoreBtnClick from '../Button';
import LoaderSpinner from '../Loader';
import authContext from '../Context';
import Modal from '../Modal';
import StartPage from '../StartPage';

class ImageFinder extends Component {
  state = {
    query: '',
    picture: null,
    currentPage: 1,
    isLoading: false,
    error: null,
    gallery: [],
    isModalOpen: false,
    selectedImgURL: '',
    scroll: 0,
  };

  handleImageClick = e => {
    if (e.target.nodeName !== 'IMG') {
      return;
    }

    e.preventDefault();
    const fullImgLink = e.target.getAttribute('data-large');
    this.setState({
      selectedImgURL: fullImgLink,
      isModalOpen: true,
    });
  };

  componentDidUpdate(props, state) {
    const { query, scroll, currentPage } = this.state;
    if (state.query !== query) {
      this.fetchPictures();
    }
    if (state.scroll !== scroll && currentPage > 2) {
      window.scrollTo({
        top: scroll - 200,
        behavior: 'smooth',
      });
    }
  }

  fetchPictures = () => {
    const { query, currentPage } = this.state;
    this.setState({ isLoading: true });
    const scrollHeight = document.documentElement.scrollHeight;
    apiService(query, currentPage)
      .then(images => {
        this.setState(prevState => ({
          gallery: [...prevState.gallery, ...images],
          currentPage: prevState.currentPage + 1,
          scroll: scrollHeight,
        }));
      })
      .catch(error => this.setState({ error }))
      .finally(() => {
        // this.onLoadMoreBtnClick();
        this.setState({ isLoading: false });
      });
  };

  handleFormSubmit = query => {
    this.setState({ query });
  };

  handleSubmit = query => {
    if (query !== this.state.query) {
      this.setState({
        gallery: [],
        query: query,
        currentPage: 1,
        error: null,
      });
    }
  };

  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });

    if (this.state.isModalOpen) {
      document.body.style.overflowY = 'hidden';
    }
  };

  render() {
    const {
      gallery,
      query,
      isModalOpen,
      selectedImgURL,
      isLoading,
    } = this.state;
    return (
      <div>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {gallery.length === 0 && <StartPage />}
        <ToastContainer />
        <div className="Wrapper">{isLoading && <LoaderSpinner />}</div>
        <authContext.Provider value={this.handleImageClick}>
          {query && <ImageGallery gallery={gallery} />}
        </authContext.Provider>

        {isModalOpen && (
          <Modal onClose={this.toggleModal}>
            <img src={selectedImgURL} alt="fullsizeImage"></img>
          </Modal>
        )}
        <div className="BtnWrapper">
          {query && gallery.length > 11 && (
            <OnLoadMoreBtnClick onClick={this.fetchPictures} />
          )}
        </div>
      </div>
    );
  }
}

export default ImageFinder;
