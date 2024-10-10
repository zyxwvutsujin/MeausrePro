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

function Main() {
    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    // 좌표 저장
    const [geometryData, setGeometryData] = useState('');
    // 폴리곤 생성
    const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
    // 프로젝트 생성 모달
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    // 프로젝트 목록 상태
    const [projectList, setProjectList] = useState([]);
    // 프로젝트 선택 시, 프로젝트 정보 보여주기
    const [isSelectedProject, setIsSelectedProject] = useState(null);
    // 버튼 텍스트 관리
    const [isBtnText, setIsBtnText] = useState('프로젝트 생성')
    // 구간 생성 모달
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

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
            window.location.reload();
        } else {
            setIsDrawingEnabled(true);
            setIsBtnText('프로젝트 생성 취소')
        }
    }

    // 프로젝트 생성 모달 닫기
    const closeProjectModal = () => {
        setIsProjectModalOpen(false);
    }
    // 프로젝트 생성 후 바로 반영 (프로젝트 목록 다시 불러오기)
    const onProjectCreated = () => {
        fetchProjects(); // 프로젝트 목록 다시 불러오기
        setIsDrawingEnabled(false); // 폴리곤 생성 모드 종료
        setIsBtnText('프로젝트 생성');
        setIsProjectModalOpen(false); // 모달 닫기
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
    return (
        <div>
            <header>
                <Header />
            </header>
            <div className={'container-fluid p-0 mx-0 my-5'}>
                <NavBar topManager={user.topManager} />
                <MainSideBar
                    enableDrawing = {enableDrawing}
                    handleProjectClick = {handleProjectClick}
                    openSectionModal = {openSectionModal}
                    projectBtnText = {isBtnText}
                    projectList={projectList}
                />
                <div className={'mainSection'}>
                    <MapComponent
                        sendGeometry = {handleGeometryData}
                        isDrawingEnabled = {isDrawingEnabled}
                        setIsDrawingEnabled = {setIsDrawingEnabled}
                        projectList={projectList}
                    />
                    <ProjectCreateModal
                        geometryData = {geometryData}
                        isOpen = {isProjectModalOpen}
                        closeModal = {closeProjectModal}
                        onProjectCreated={onProjectCreated} // 생성 완료 후 콜백
                    />
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
