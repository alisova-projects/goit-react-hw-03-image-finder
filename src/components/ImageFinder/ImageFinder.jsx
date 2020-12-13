import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import Searchbar from '../Searchbar';
import apiService from '../ApiService';
import ImageGallery from '../ImageGallery';
import OnLoadMoreBtnClick from '../Button';
import LoaderSpinner from '../Loader';
import authContext from '../Context';
import Modal from '../Modal';
import StartPage from '../StartPage';

class ImageFinder extends Component {
  state = {
    pictureName: '',
    picture: null,
    currentPage: 1,
    isLoading: false,
    error: null,
    gallery: [],
    isModalOpen: false,
    selectedImgURL: '',

    handleImageClick: e => {
      if (e.target.nodeName !== 'IMG') {
        return;
      }

      e.preventDefault();
      const fullImgLink = e.target.getAttribute('data-large');
      this.setState({
        selectedImgURL: fullImgLink,
        isModalOpen: true,
      });
    },
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevState.pictureName;
    const nextName = this.state.pictureName;

    if (prevName !== nextName) {
      this.fetchPictures();
    }
  }

  fetchPictures = () => {
    const { pictureName, currentPage } = this.state;

    this.setState({ isLoading: true });

    apiService(pictureName, currentPage)
      .then(images => {
        this.setState(prevState => ({
          gallery: [...prevState.gallery, ...images],
          currentPage: prevState.currentPage + 1,
        }));
      })
      .catch(error => this.setState({ error }))
      .finally(() => {
        this.onLoadMoreBtnClick();
        this.setState({ isLoading: false });
      });
  };

  handleFormSubmit = pictureName => {
    this.setState({ pictureName });
  };

  handleSubmit = query => {
    if (query !== this.state.pictureName) {
      this.setState({
        gallery: [],
        pictureName: query,
        currentPage: 1,
        error: null,
      });
    }
  };

  onLoadMoreBtnClick = () => {
    if (this.state.currentPage > 2) {
      const options = {
        top: null,
        behavior: 'smooth',
      };

      options.top = window.pageYOffset + document.documentElement.clientHeight;
      setTimeout(() => {
        window.scrollTo(options);
      }, 1000);
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
      pictureName,
      handleImageClick,
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
        <authContext.Provider value={handleImageClick}>
          {pictureName && <ImageGallery gallery={gallery} />}
        </authContext.Provider>

        {isModalOpen && (
          <Modal onClose={this.toggleModal}>
            <img src={selectedImgURL} alt="fullsizeImage"></img>
          </Modal>
        )}
        <div className="BtnWrapper">
          {pictureName && gallery.length > 11 && (
            <OnLoadMoreBtnClick onClick={this.fetchPictures} />
          )}
        </div>
      </div>
    );
  }
}

export default ImageFinder;
