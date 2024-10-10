import {useContext, useEffect, useState} from "react";
import UserContext from "../context/UserContext.jsx";
import {useNavigate} from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/ProjectCreateModal.jsx";
import SectionCreateModal from "../component/SectionCreateModal.jsx";
import MainSideBar from "../component/MainSideBar.jsx";
import NavBar from "../component/NavBar.jsx";
import Header from "../layout/Header.jsx";
import axios from "axios";
import ProjectEditModal from "../component/ProjectEditModal.jsx";

function Main() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    const [moveToPolygon, setMoveToPolygon] = useState(null);  // moveToPolygon 추가

    // 좌표 저장
    const [geometryData, setGeometryData] = useState('');
    // 폴리곤 생성
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    // 프로젝트 생성 모달
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [mapKey, setMapKey] = useState(0); // 맵을 다시 불러오기 위한 키 상태
    const [sideBarKey, setSideBarKey] = useState(0);
    // 프로젝트 목록 상태
    const [projectList, setProjectList] = useState([]);
    // 프로젝트 선택 시, 프로젝트 정보 보여주기
    const [isSelectedProject, setIsSelectedProject] = useState(null);
    // 버튼 텍스트 관리
    const [isBtnText, setIsBtnText] = useState('프로젝트 생성')
    // 구간 생성 모달
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태 추가

    // 로그인 정보 없을 시, 로그인 페이지로 이동
    useEffect(() => {
        if (!user.id) {
            // 로그인 정보 없을 시, 로그인 페이지로 리다이렉트
            navigate('/');
        }
        fetchProjects();
    }, [user, navigate]);

    // 프로젝트 목록을 가져오는 함수
    const fetchProjects = () => {
        axios.get(`http://localhost:8080/MeausrePro/Project/inProgress/${encodeURIComponent(user.id)}/${user.topManager}`)
            .then(res => {
                setProjectList(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    // 좌표 데이터 받는 함수
    // 프로젝트 생성 모달
    const handleGeometryData = (coordinates) => {
        setGeometryData(coordinates);
        setIsProjectModalOpen(true);
        console.log(coordinates);
    }

    // 프로젝트 생성, 취소 버튼 클릭 시 폴리곤 생성 모드 활성화 및 취소
    const enableDrawing = () => {
        if (isDrawingEnabled) {
            setIsDrawingEnabled(false);
            setIsBtnText('프로젝트 생성');
            // 맵 컴포넌트를 다시 불러오기 위해 key 값을 업데이트
            setMapKey(prevKey => prevKey + 1);
        } else {
            setIsDrawingEnabled(true);
            setIsBtnText('프로젝트 생성 취소');
        }
    };

    // 프로젝트 생성 모달 닫기
    const closeProjectModal = () => {
        setIsProjectModalOpen(false);
    }
    // 프로젝트 생성 후 바로 반영 (프로젝트 목록 다시 불러오기)
    const onProjectCreated = () => {
        fetchProjects();
        setIsDrawingEnabled(false);
        setIsBtnText('프로젝트 생성');
        setIsProjectModalOpen(false);
        setMapKey(prevKey => prevKey + 1); // 프로젝트 생성 후에도 맵을 다시 로드
    };
    // 구간 생성 모달 열기
    const openSectionModal = () => {
        setIsSectionModalOpen(true);
    }
    // 구간 생성 모달 닫기
    const closeSectionModal = () => {
        setIsSectionModalOpen(false);
    }

    // 프로젝트 선택 시 해당 프로젝트 정보 표시
    const handleProjectClick = (project) => {
        setIsSelectedProject(project);
    }

    // 수정 모달 열기 함수
    const openEditModal = (project) => {
        setIsSelectedProject(project);
        setIsEditModalOpen(true);
    };

    // 수정 모달 닫기 함수
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setIsSelectedProject(null);
    };

    // 수정 완료 시 프로젝트 목록 업데이트
    const onProjectUpdated = () => {
        fetchProjects();
        setIsEditModalOpen(false);
        setSideBarKey(prevKey => prevKey + 1); // 사이드바 리로드
        setMapKey(prevKey => prevKey + 1); // 맵을 다시 로드하여 최신 상태 반영
    };

    // 프로젝트 목록 업데이트 후 선택한 프로젝트 정보 업데이트
    useEffect(() => {
        if (isSelectedProject) {
            const updatedProject = projectList.find(p => p.idx === isSelectedProject.idx);
            if (updatedProject) {
                setIsSelectedProject(updatedProject);
            }
        }
    }, [projectList]);

    // 프로젝트 삭제
    const deleteProject = (projectId) => {
        axios.delete(`http://localhost:8080/MeausrePro/Project/delete/${projectId}`)
            .then(() => {
                alert("프로젝트가 삭제되었습니다.");
                setProjectList(prevList => prevList.filter(project => project.idx !== projectId));
                setMapKey(prevKey => prevKey + 1); // 맵을 다시 로드하여 변경 반영
                setSideBarKey(prevKey => prevKey + 1); // 사이드바 리로드
            })
            .catch(err => {
                console.error("프로젝트 삭제 중 오류 발생:", err);
            });
    };


    return (
        <div>
            <header>
                <Header />
            </header>
            <div className={'container-fluid p-0 mx-0 my-5'}>
                <NavBar topManager={user.topManager} />
                <MainSideBar
                    key={`${sideBarKey}-${mapKey}`}
                    enableDrawing = {enableDrawing}
                    handleProjectClick = {handleProjectClick}
                    openSectionModal = {openSectionModal}
                    projectBtnText = {isBtnText}
                    projectList={projectList}
                    moveToPolygon={moveToPolygon}  // moveToPolygon 전달
                    setProjectList={setProjectList}
                    openEditModal={openEditModal} // 수정 모달 열기 함수 전달
                    deleteProject={deleteProject}
                />
                <div className={'mainSection'}>
                    <MapComponent
                        key={mapKey} // key를 이용해 맵 컴포넌트를 다시 로드
                        sendGeometry = {handleGeometryData}
                        isDrawingEnabled = {isDrawingEnabled}
                        setIsDrawingEnabled = {setIsDrawingEnabled}
                        projectList={projectList}
                        setMoveToPolygon={setMoveToPolygon}  // moveToPolygon 설정
                    />
                    <ProjectCreateModal
                        geometryData={geometryData}
                        isOpen={isProjectModalOpen}
                        closeModal={closeProjectModal}
                        onProjectCreated={onProjectCreated} // 생성 완료 후 콜백
                    />
                    <ProjectEditModal
                        projectData={isSelectedProject}
                        isOpen={isEditModalOpen}
                        closeModal={closeEditModal}
                        onProjectUpdated={onProjectUpdated}/>
                    <SectionCreateModal
                        project = {isSelectedProject}
                        isOpen = {isSectionModalOpen}
                        closeModal = {closeSectionModal} />
                </div>
            </div>
        </div>
    )
}

export default Main;
