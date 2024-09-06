import styles from './Category.module.css'
import img from '../../../../../assets/images/마이페이지_프로필사진.jpg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from '../../../../../config/config';

import img1 from '../../../../../assets/images/interior_1.jpg';
import img2 from '../../../../../assets/images/interior_2.jpg';
import img3 from '../../../../../assets/images/interior_3.jpg';
import img4 from '../../../../../assets/images/interior_4.jpg';
import img5 from '../../../../../assets/images/interior_5.jpg';
import img6 from '../../../../../assets/images/interior_6.jpg';
import { useNavigate } from 'react-router-dom';
import { Product } from '../Product/Product';
import { Detail } from '../Detail/Detail';

export const Category = () => {
  const navi = useNavigate();

  // 카테고리명 상태 
  const [categoriesList,setCategoriesList] = useState([]);

  // ===== 가격 버튼 클릭시 나오는 라디오 박스 토글 =====
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('전체');

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSelectedOption('전체'); 
  };
  // ===== 가격 버튼 클릭시 나오는 라디오 박스 토글 =====



    // 임시 데이터
    const [products, setProducts] = useState([
      {product_seq:1, product_thumbnail: img1,product_title:'상품명1', product_contents:'상품설명1', price:'30,000,000', product_category_code:'P1'},
      {product_seq:2, product_thumbnail: img2,product_title:'상품명2', product_contents:'상품설명2', price:'30,000,000', product_category_code:'P1'},
      {product_seq:3, product_thumbnail: img3,product_title:'상품명3', product_contents:'상품설명3', price:'100,000', product_category_code:'P2'},
      {product_seq:4, product_thumbnail: img4,product_title:'상품명4', product_contents:'상품설명4', price:'2,000,000', product_category_code:'P3'},
      {product_seq:5, product_thumbnail: img5,product_title:'상품명5', product_contents:'상품설명5', price:'8,000,000', product_category_code:'P4'},
      {product_seq:6, product_thumbnail: img6,product_title:'상품명6', product_contents:'상품설명6', price:'35,000', product_category_code:'P5'},
      {product_seq:7, product_thumbnail: img1,product_title:'상품명7', product_contents:'상품설명7', price:'30,000', product_category_code:'P6'},
      {product_seq:8, product_thumbnail: img2,product_title:'상품명8', product_contents:'상품설명8', price:'300,000', product_category_code:'P6'},
      {product_seq:9, product_thumbnail: img3,product_title:'상품명9', product_contents:'상품설명9', price:'130,000,000', product_category_code:'P1'},
      {product_seq:10, product_thumbnail: img4,product_title:'상품명10', product_contents:'상품설명10', price:'90,000,000', product_category_code:'P1'},
      {product_seq:11, product_thumbnail: img5,product_title:'상품명11', product_contents:'상품설명11', price:'80,000,000', product_category_code:'P1'},
      {product_seq:12, product_thumbnail: img6,product_title:'상품명12', product_contents:'상품설명12', price:'50,000,000', product_category_code:'P1'},
    ])


  useEffect(() => {
    axios.get(`${host}/category`)
      .then((resp) => {
        // console.log(JSON.stringify(resp))
        setCategoriesList(resp.data);  
      })
      .catch((err) => {
        console.error(err); 
      });
  }, []);  // 컴포넌트가 처음 렌더링될 때 한 번만 실행

  return (
    <div className={styles.container}>
        <div className={styles.contents}>
          <div className={styles.side}>
              {
                categoriesList.map((item,i)=>{
                  return(
                    <ul className={styles.list} key={i}>
                      <li>{item.product_category_title}</li>
                    </ul>
                  )
                })
              }
          </div>
          <div className={styles.content}>

            <div>
              <div className={styles.option}>
                <div onClick={handleToggle}>
                  가격
                </div>
                {/* 토글 상태에 따라 라디오 버튼을 포함한 메뉴를 표시 */}
                {isOpen && (
                  <div className={styles.dropdown}>
                    <label>
                      <input type="radio" name="priceOption" checked={selectedOption === '전체'} onChange={() => handleSelect('전체')}/>  전체
                    </label>
                    <label>
                      <input type="radio" name="priceOption" checked={selectedOption === '50,000원 이하'} onChange={() => handleSelect('50,000원 이하')}/>  50,000원 이하
                    </label>
                    <label>
                      <input type="radio" name="priceOption" checked={selectedOption === '50,000원 ~ 100,000원'} onChange={() => handleSelect('50,000원 ~ 100,000원')}/>  50,000원 ~ 100,000원
                    </label>
                    <label>
                      <input type="radio" name="priceOption" checked={selectedOption === '100,000원 ~ 200,000원'} onChange={() => handleSelect('100,000원 ~ 200,000원')}/>  100,000원 ~ 200,000원
                    </label>
                    <label>
                      <input type="radio" name="priceOption" checked={selectedOption === '200,000원 ~ 300,000원'} onChange={() => handleSelect('200,000원 ~ 300,000원')}/>  200,000원 ~ 300,000원
                    </label>
                    <label>
                      <input type="radio" name="priceOption" checked={selectedOption === '300,000원 ~ 400,000원'} onChange={() => handleSelect('300,000원 ~ 400,000원')}/>  300,000원 ~ 400,000원
                    </label>
                    <label>
                      <input type="radio" name="priceOption" checked={selectedOption === '400,000원 ~ 500,000원'} onChange={() => handleSelect('400,000원 ~ 500,000원')}/>  400,000원 ~ 500,000원
                    </label>
                    <label>
                      <input type="radio" name="priceOption" checked={selectedOption === '500,000원 이상'} onChange={() => handleSelect('500,000원 이상')}/>  500,000원 이상
                    </label>
                  </div>
                )}
                <div>
                  <div>
                    <select>
                      <option>인기순</option>
                      <option>추천순</option>
                      <option>판매순</option>
                      <option>최신순</option>
                      <option>낮은 가격순</option>
                      <option>높은 가격순</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.length}>{products.length}개</div>
            </div>

            <div>
            {
                products.map((item)=>{
                  return(
                    <div className={styles.item} key={item.product_seq} onClick={()=>navi(`/products/${item.product_seq}`)}>
                      <div className={styles.img}><img src={item.product_thumbnail} alt='img'></img></div>
                      <div className={styles.title}>
                        <div>{item.product_title}</div>
                        <div>{item.price}</div>
                      </div>
                    </div>
                  )
                })
            }
            </div>
          </div>
        </div>
    </div>
  );
}