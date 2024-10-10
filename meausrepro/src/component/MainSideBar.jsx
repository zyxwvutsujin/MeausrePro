import {useContext, useEffect, useRef, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import axios from "axios";

function MainSideBar(props) {
    const { user } = useContext(UserContext);
    const { enableDrawing, openSectionModal,
         projectBtnText, projectList , moveToPolygon, openEditModal, deleteProject} = props;

    // 프로젝트 선택
    const [isSelectProject, setIsSelectProject] = useState(null);
    // 특정 프로젝트 구간
    const [sectionList, setSectionList] = useState([]);
    // 구간 드롭다운 상태 관리
    const [openSection, setOpenSection] = useState(null); // null일 때는 모든 드롭다운이 닫힘
    // 각 구간의 드롭다운 높이 저장
    const dropdownRefs = useRef({});

    const handleSelectProject = (project) => {
        if (moveToPolygon) {
            console.log("자동 이동: 선택한 폴리곤으로 이동합니다.", project.geometry);
            moveToPolygon(project.geometry);
        } else {
            console.warn("moveToPolygon 함수가 아직 정의되지 않았습니다.");
        }
        setIsSelectProject(project);
        handleSectionList(project.idx);
    };


    // moveToPolygon 함수가 설정되었는지 확인하는 useEffect 추가
    useEffect(() => {
        if (moveToPolygon) {
            console.log("moveToPolygon 함수가 설정되었습니다.");
        } else {
            console.warn("moveToPolygon 함수가 아직 정의되지 않았습니다.");
        }
    }, [moveToPolygon]);


    // 구간생성에서 뒤로 가기
    const handleBack = () => {
        setIsSelectProject(null);
    }

    // 특정 프로젝트 구간 보기
    const handleSectionList = (projectId) => {
        axios.get(`http://localhost:8080/MeausrePro/Section/${projectId}`)
            .then(res=> {
                console.log(res);
                const { data } = res;
                setSectionList(data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    // 구간 클릭 시 드롭다운 토글
    const toggleSectionDropdown = (sectionId) => {
        if (openSection === sectionId) {
            setOpenSection(null); // 이미 열려 있으면 닫기
        } else {
            setOpenSection(sectionId); // 해당 구간의 드롭다운 열기
        }
    };

    // 드롭다운의 최대 높이를 계산하여 부드럽게 열리고 닫히게 하는 기능
    useEffect(() => {
        if (openSection !== null) {
            const dropdown = dropdownRefs.current[openSection];
            if (dropdown) {
                dropdown.style.maxHeight = dropdown.scrollHeight + "px"; // 내용 높이만큼 설정
            }
        } else {
            Object.values(dropdownRefs.current).forEach((dropdown) => {
                dropdown.style.maxHeight = "0"; // 닫힐 때는 0으로 설정
            });
        }
    }, [openSection]);

    // 프로젝트 삭제
    const handleDelete = () => {
        if (window.confirm("프로젝트를 삭제하시겠습니까?")) {
            deleteProject(isSelectProject.idx); // Main에서 전달된 deleteProject 사용
            setIsSelectProject(null);
        }
    };


    return (
        <div className={"sideBar"}>
            {isSelectProject ? (
                <div className={"d-flex flex-column"}>
                    <div className={'d-flex justify-content-between'}>
                        <span>{user.name}</span>
                        <button type={"button"} className={"btn btn-close"} onClick={handleBack}/>
                    </div>
                    <hr/>
                    <div key={isSelectProject.idx} className={"d-flex flex-column gap-1"}>
                        <span>{isSelectProject.siteName}</span>
                        <span>주소: {isSelectProject.siteAddress}</span>
                        <span>시작일자: {isSelectProject.startDate}</span>
                        <span>종료일자: {isSelectProject.endDate}</span>
                        <span>시공사: {isSelectProject.contractor}</span>
                        <span>계측사: {isSelectProject.measurer}</span>
                        <span className={"small"}>지오매트리: {isSelectProject.geometry}</span>
                    </div>
                    <div className="d-flex gap-2 mt-2">
                        <button className="btn btn-outline-primary" onClick={() => openEditModal(isSelectProject)}>
                             수정
                        </button>
                        <button className="btn btn-outline-danger" onClick={handleDelete}>
                             삭제
                        </button>
                    </div>
                    <hr/>
                    <ul className={"nav nav-pills flex-column mb-auto"}>
                        {sectionList.map((item) => {
                            return (
                                <li key={item.idx} className={`mb-2`}>
                                    <button
                                        className={"nav-link link-dark"}
                                        type={"button"}
                                        onClick={() => toggleSectionDropdown(item.idx)}
                                    >
                                        {item.sectionName}
                                    </button>
                                    <div
                                        ref={(el) => (dropdownRefs.current[item.idx] = el)}
                                        className={`dpContent ${openSection === item.idx ? 'open' : ''}`}
                                    >
                                        <span className={'fs-5'}>
                                            구간 기본정보
                                        </span>
                                        <span>
                                            속성
                                        </span>
                                        <div className={'dpSection'}>
                                            <span className={'sectionTitle'}>
                                                구간명
                                            </span>
                                            <span>
                                                {item.sectionName}
                                            </span>
                                            <span className={'sectionTitle'}>
                                                구간위치(STA)
                                            </span>
                                            <span>
                                                {item.sectionSta}
                                            </span>
                                            <span className={'sectionTitle'}>
                                                벽체공
                                            </span>
                                            <span>
                                                {item.wallStr}
                                            </span>
                                            <span className={'sectionTitle'}>
                                                지지공
                                            </span>
                                            <span>
                                                {item.groundStr}
                                            </span>
                                            <span className={'sectionTitle'}>
                                                주요관리대상물배면
                                            </span>
                                            <span>
                                                {item.rearTarget}
                                            </span>
                                            <span className={'sectionTitle'}>
                                                주요관리대상물도로하부
                                            </span>
                                            <span>
                                                {item.underStr}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    {/* 구간 생성 버튼 */}
                    <div className="mt-3">
                        <button className={"nav-link link-dark"} type={"button"} onClick={openSectionModal}>
                            구간 생성
                        </button>
                    </div>
                </div>
            ) : (
                <div className={"d-flex flex-column"}>
                    <span>{user.name}</span>
                    <hr/>
                    <span>진행 중인 프로젝트</span>
                    <ul className={"nav nav-pills flex-column mb-auto"}>
                        {projectList.map((item) => {
                            return (
                                <li key={item.idx}>
                                    <button
                                        className={"nav-link link-dark"}
                                        onClick={() => handleSelectProject(item)}
                                    >
                                        {item.siteName}
                                    </button>
                                </li>
                            );
                        })}
                        <li>
                            <button className={"nav-link link-dark"} type={"button"} onClick={enableDrawing}>
                                {projectBtnText}
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MainSideBar;