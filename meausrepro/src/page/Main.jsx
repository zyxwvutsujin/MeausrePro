import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext.jsx";
import { useNavigate } from "react-router";
import MapComponent from "../component/MapComponent.jsx";
import ProjectCreateModal from "../component/ProjectCreateModal.jsx";
import SectionCreateModal from "../component/SectionCreateModal.jsx";
import MainSideBar from "../component/MainSideBar.jsx";
import CustomSidebar from "../component/CustomSidebar.jsx";
import axios from "axios";
import InstrumentCreateModal from "../component/InstrumentCreateModal.jsx";

function Main() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // 지도 로드
    const [isMapReady, setIsMapReady] = useState(false);
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
    // 구간 선택 시, 구간 정보 보여주기
    const [isSelectedSection, setIsSelectedSection] = useState(null);
    // 버튼 텍스트 관리
    const [isBtnText, setIsBtnText] = useState('프로젝트 생성');
    // 구간 생성 모달
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    // 계측기 생성 모달
    const [isInstrumentModalOpen, setIsInstrumentModalOpen] = useState(false);


    // 계측기 좌표 저장
    const [insGeometryData, setInsGeometryData] = useState('');
    // 마커 생성
    const [isDrawingEnabledMarker, setIsDrawingEnabledMarker] = useState(false);
    // 계측기 추가 버튼 텍스트 관리
    const [isInsBtnText, setIsInsBtnText] = useState('계측기 추가');

    // 계측기 좌표 데이터 받는 함수
    const handelInsGeometryData = (insCoordinates) => {
        setInsGeometryData(insCoordinates);
        setIsInstrumentModalOpen(true);
        console.log(insCoordinates);
    };

    // 계측기 추가 버튼 클릭 시 마커 생성 모드 활성화 및 취소
    const enableDrawingMarkers = () => {
        if (isDrawingEnabledMarker) {
            setIsDrawingEnabledMarker(false);
            setIsInsBtnText('계측기 추가')
            // window.location.reload();
        } else {
            setIsDrawingEnabledMarker(true);
            setIsInsBtnText('계측기 추가')
        }
    };



    // 로그인 정보 없을 시, 로그인 페이지로 이동
    useEffect(() => {
        if (!user || !user.id) {
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
    const handleGeometryData = (coordinates) => {
        setGeometryData(coordinates);
        setIsProjectModalOpen(true);
        console.log(coordinates);
    };

    // 프로젝트 생성, 취소 버튼 클릭 시 폴리곤 생성 모드 활성화 및 취소
    const enableDrawing = () => {
        if (isDrawingEnabled) {
            setIsDrawingEnabled(false);
            setIsBtnText('프로젝트 생성');
            window.location.reload();
        } else {
            setIsDrawingEnabled(true);
            setIsBtnText('프로젝트 생성 취소');
        }
    };

    // 프로젝트 생성 모달 닫기
    const closeProjectModal = () => {
        setIsProjectModalOpen(false);
    };

    // 프로젝트 생성 후 바로 반영 (프로젝트 목록 다시 불러오기)
    const onProjectCreated = () => {
        fetchProjects();
        setIsDrawingEnabled(false);
        setIsBtnText('프로젝트 생성');
        setIsProjectModalOpen(false);
    };

    // 구간 생성 모달 열기
    const openSectionModal = () => {
        setIsSectionModalOpen(true);
    };

    // 구간 생성 모달 닫기
    const closeSectionModal = () => {
        setIsSectionModalOpen(false);
    };

    // 계측기 생성 모달 닫기
    const closeInstrumentModal = () => {
        setIsInstrumentModalOpen(false);
    };

    // 프로젝트 선택 시 해당 프로젝트 정보 표시
    const handleProjectClick = (project) => {
        setIsSelectedProject(project);
    };

    // 구간 선택 시 해당 구간 정보 표시
    const handleSectionClick = (section) => {
        setIsSelectedSection(section);
    }

    return (
        <div className={'d-flex vh-100'}>
            <CustomSidebar topManager={user.topManager} />
            <div className={'flex-grow-1 d-flex'}>
                <MainSideBar
                    enableDrawing={enableDrawing}
                    enableDrawingMarkers={enableDrawingMarkers} // 계측기 마커
                    handleProjectClick={handleProjectClick}
                    handleSectionClick={handleSectionClick}
                    openSectionModal={openSectionModal}
                    projectBtnText={isBtnText}
                    projectList={projectList}
                    instrumentBtnText={isInsBtnText} // 계측기 추가 버튼
                />
                <div className={'flex-grow-1'}>
                    <MapComponent
                        sendGeometry={handleGeometryData}
                        sendInsGeometry={handelInsGeometryData} // 계측기 지오매트리 정보
                        isDrawingEnabled={isDrawingEnabled}
                        isDrawingEnabledMarker={isDrawingEnabledMarker} // 마커 생성 활성화
                        setIsDrawingEnabled={setIsDrawingEnabled}
                        setIsDrawingEnabledMarker={setIsDrawingEnabledMarker} // 마커 생성
                        isModalOpen={isProjectModalOpen}
                        isInsModalOpen={isInstrumentModalOpen} // 계측기 모달창 열기
                        setIsMapReady={setIsMapReady}
                    />
                    <ProjectCreateModal
                        geometryData={geometryData}
                        isOpen={isProjectModalOpen}
                        closeModal={closeProjectModal}
                        onProjectCreated={onProjectCreated}
                    />
                    <SectionCreateModal
                        project={isSelectedProject}
                        isOpen={isSectionModalOpen}
                        closeModal={closeSectionModal}
                    />
                    <InstrumentCreateModal
                        insGeometryData={insGeometryData} // 계측기 좌표
                        projectData={isSelectedProject}
                        section={isSelectedSection}
                        isOpen={isInstrumentModalOpen}
                        closeModal={closeInstrumentModal}
                    />
                </div>
            </div>
        </div>
    );
}

export default Main;