import React, { useEffect, useState } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useNavigate,
  } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import DaumPostcode from 'react-daum-postcode';
import {
  OuterDiv,
  TopDiv,
  MainDiv,
  IndexBoxDiv,
  IndexDiv,
  IndexInput,
  BankAccountBoxDiv,
  AccountInput,
  ContentIndexBoxDiv,
  ContentIndexDiv,
  ContentTextarea,
  BottomDiv,
  CompleteButton,
  ModalBackdrop,
  AddressModalView,
  AlertModalView,
  AlertModalDiv,
  AlertModalButton,
  MenuSelectBox,
  SelectBoxNum,
  BankSelectBox
} from '../components/EditPostComponents';

// let url = "https://localhost:4000";

const CreatePost = (props) => {
  

  const [inputTitle, setInputTitle] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [selectMenu, setSelectMenu] = useState("");
  const [selectNum, setSelectNum] = useState("");
  const [inputFee, setInputFee] = useState("");
  const [selectBank, setSelectBank] = useState("");
  const [inputAccount, setInputAccount] = useState("");
  const [textareaContent, setTextareaContent] = useState("");


  useEffect(() => {
      setInputTitle(props.nowPost.title);
      setInputAddress(props.nowPost.address);
      setSelectMenu(props.nowPost.menu);
      setSelectNum(props.nowPost.recruit_volume);
      setInputFee(props.nowPost.delivery_charge);
      setSelectBank(props.nowPost.bank_name);
      setInputAccount(props.nowPost.account_number);
      setTextareaContent(props.nowPost.content);
  },[])
  
  // 도로명주소 찾기, 누락 알림 모달창 상태관리
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // 입력값 변경에 따라 상태 변화
  const handleInputValue = (e) => {
    console.log("input 입력값 변경");
    if(e.target.name === 'title'){
      setInputTitle(e.target.value);
    } else if(e.target.name === 'fee'){
      setInputFee(e.target.value);
    } else if(e.target.name === 'account'){
      setInputAccount(e.target.value);
    }
  };

  const handleSelectValue = (e) => {
    console.log("셀렉트 박스 변경");
    if(e.target.name === 'menu'){
      setSelectMenu(e.target.value);
    } else if(e.target.name === 'num'){
      setSelectNum(e.target.value);
    } else if(e.target.name === 'bank'){
      setSelectBank(e.target.value);
    }
  };

  const handleTextareaValue = (e) => {
    console.log("textarea 내용 변경");
    setTextareaContent(e.target.value);
  }
  
  // 도로명주소 찾기 모달창 상태 변경
  const openAddressModalHandler = () => {
    setIsAddressModalOpen(!isAddressModalOpen);
  };

  // 입력 누락 알림 모달창 상태 변경
  const openAlertModalHandler = () => {
    setIsAlertModalOpen(!isAlertModalOpen);
  }
  
  // 도로명주소 찾기에서 원하는 주소를 클릭했을때
  const onCompletePost = (data) => {
    console.log(data.roadAddress)
    setInputAddress(data.roadAddress);
    setIsAddressModalOpen(!isAddressModalOpen);
  }
  
  // 작성완료 버튼 클릭
  // 게시물 정보 -> 서버로
  const postCompleteButton = () => {
    console.log("수정완료 버튼 클릭");
    console.log(inputTitle, inputAddress, selectMenu,
       selectNum, inputFee, selectBank, inputAccount, textareaContent)
    
    if(inputTitle.length > 0 &&
       inputAddress.length > 0 &&
       selectMenu.length > 0 &&
       selectNum.length > 0 &&
       String(inputFee).length > 0 &&
       selectBank.length > 0 &&
       String(inputAccount).length > 0 &&
       textareaContent.length > 0
    ) {
      axios({
        // url: url + '/post',
        method: "patch",
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
          "Content-Type": "application/json"
        },
        data: {
            title: inputTitle,
            address: inputAddress,
            menu: selectMenu,
            recruit_volume: selectNum,
            bank_name: selectBank,
            accout_number: inputAccount,
            content: textareaContent,
            delivery_chare: inputFee
          },
          withCredentials: true,
      })
        .then(() => {
          console.log("게시글 수정 완료")
        })
        .catch((err) => console.log(err))
      } else {
          openAlertModalHandler();
        }
  }
  
  
    return (
      <>
      {isAddressModalOpen === true ?
        <ModalBackdrop onClick={openAddressModalHandler}>
          <AddressModalView>
            <DaumPostcode
              autoClose
              onComplete={onCompletePost}></DaumPostcode>
          </AddressModalView>
        </ModalBackdrop>
      : null
      }
      {isAlertModalOpen === true ?
        <ModalBackdrop>
          <AlertModalView>
            <AlertModalDiv>모든 항목을 입력해주세요!</AlertModalDiv>
            <AlertModalButton onClick={openAlertModalHandler}>
              확인
            </AlertModalButton>
          </AlertModalView>  
        </ModalBackdrop>
      : null  
      }
        <h1> 헤더 컴포넌트 자리 </h1>
        <OuterDiv>
            <TopDiv>게시글 수정</TopDiv>
            <MainDiv>
              <IndexBoxDiv>
                <IndexDiv>제목</IndexDiv>
                <IndexInput
                  name="title" 
                  type="text"
                  maxLength="30"
                  value={inputTitle}
                  onChange={handleInputValue} />
              </IndexBoxDiv>
              <IndexBoxDiv>
                <IndexDiv>도로명주소</IndexDiv>
                <IndexInput
                  name="address"
                  type="text"
                  value={inputAddress}
                  onClick={openAddressModalHandler}
                  onChange={openAddressModalHandler} />
              </IndexBoxDiv>
              <IndexBoxDiv>
                <IndexDiv>메뉴</IndexDiv>
                <MenuSelectBox
                  value={selectMenu}
                  name="menu"
                  onChange={handleSelectValue} />
              </IndexBoxDiv>
              <IndexBoxDiv>
                <IndexDiv>모집 인원</IndexDiv>
                <SelectBoxNum
                  value={selectNum}
                  name="num"
                  onChange={handleSelectValue} />
              </IndexBoxDiv>
              <IndexBoxDiv>
                <IndexDiv>전체 배달료</IndexDiv>
                <IndexInput
                  name="fee"
                  type="number"
                  value={inputFee}
                  onChange={handleInputValue} />
              </IndexBoxDiv>
              <IndexBoxDiv>
                <IndexDiv>입금받을 은행 및 계좌번호</IndexDiv>
                <BankAccountBoxDiv>
                  <BankSelectBox
                    value={selectBank}
                    name="bank"
                    onChange={handleSelectValue} />
                  <AccountInput
                    name="account"
                    type="number"
                    value={inputAccount}
                    onChange={handleInputValue} />
                </BankAccountBoxDiv>  
              </IndexBoxDiv>
              <ContentIndexBoxDiv>
                <ContentIndexDiv>내용</ContentIndexDiv>
                <ContentTextarea
                  name="content"
                  type="text"
                  value={textareaContent}
                  onChange={handleTextareaValue} />
              </ContentIndexBoxDiv>
            </MainDiv>
            <BottomDiv>
              <CompleteButton
                onClick={postCompleteButton}> 수 정 완 료 </CompleteButton>
            </BottomDiv>
        </OuterDiv>
      </>
    )
  }

  export default CreatePost;