import { useEffect } from 'react'
import { useState } from 'react'

const AddArticleForm = () => {

    const [title, setTitle] = useState("Mi articulo desde React 3")
    const [content, setContent] = useState("Contenido de mi articulo desde React")
    const [date, setDate] = useState("2023-01-01")
    const [mainPhoto, setMainPhoto] = useState(null)
    const [medias, setMedias] = useState(null);

    const [articles, setArticles] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault()

        let formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('date', date);
        formData.append('main_photo', mainPhoto);

        if (medias !== null) {
            for (let i = 0; i < medias.length; i++) {
                formData.append('medias', medias[i]);
            }
        } else {
            formData.append('medias', medias);
        }

        addArticle(formData);
    }


    const addArticle = async (formData) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/articles`, {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.article.id) {
                getArticles()
            }


        } catch (error) {
            console.log(error)
        }
    }

    const getArticles = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/articles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if (data) {
                setArticles(data)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getArticles();
    }, [])


    return (
        <>

            <form onSubmit={handleSubmit} style={{ width: '50%', margin: '0 auto' }}>
                <div className="form-group mb-3">
                    <label htmlFor="title" className="form-label">title:</label>
                    <input type="text" className="form-control" id="title" placeholder='Test Title' onChange={e => setTitle(e.target.value)} value={title} />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="main_photo" className="form-label">Main Photo:</label>
                    <input type="file" className="form-control" id="main_photo" onChange={e => setMainPhoto(e.target.files[0])} />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="medias" className="form-label">Medias:</label>
                    <input type="file" className="form-control" id="medias" onChange={e => setMedias(e.target.files)} multiple />
                </div>
                <div className="d-grid">
                    <button className="btn btn-success btn-sm gap-2">
                        Add Article
                    </button>
                </div>
            </form>

            {
                !!articles &&
                (
                    <>
                        <p className='w-50 mx-auto'>El total de articulos es: {articles.length}</p>

                        {
                            articles[articles.length - 1] &&
                            (
                                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-inner">
                                        {
                                            articles[articles.length - 1].main_photo !== 's/n' &&
                                            (
                                                <div className="carousel-item active">
                                                    <img src={articles[articles.length - 1].main_photo} className="d-block w-100" alt="..." />
                                                </div>
                                            )
                                        }

                                        {
                                            articles[articles.length - 1].gallery.map((element, index) => {
                                                let active = articles[articles.length - 1].main_photo === 's/n'
                                                console.log(element.image);
                                                return (
                                                    <div className={"carousel-item " + (index === 0 && active === true ? "active": "" )} key={index}>
                                                        <img src={element.image} className="d-block w-100" alt="..." />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                            )
                        }

                    </>
                )
            }
        </>
    )
}

export default AddArticleForm;