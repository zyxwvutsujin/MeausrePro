import {useContext, useState} from "react";
import axios from "axios";
import UserContext from "../context/UserContext.jsx";

function ProjectCreateModal(props) {
    const {user} = useContext(UserContext);
    const {geometryData, isOpen, closeModal} = props;

    // 입력 필드 상태 관리
    const [siteName, setSiteName] = useState('');
    const [address, setAddress] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [contractor, setContractor] = useState('');
    const [measurer, setMeasurer] = useState('');
    const [status, setStatus] = useState('N');
    const [siteGroup, setSiteGroup] = useState('');

    // 프로젝트 생성
    const handleCreateProject = async () => {
        console.log(geometryData);
        const wkt = `POLYGON((${geometryData.map(coord => `${coord[1]} ${coord[0]}`).join(', ')}))`;
        console.log(wkt);
        axios.post(`http://localhost:8080/MeausrePro/Project/save`, {
            manager: user,
            siteName: siteName,
            siteAddress: address,
            startDate: startDate,
            endDate: endDate,
            contractor: contractor,
            measurer: measurer,
            siteCheck: status,
            siteGroup: siteGroup,
            geometry:wkt
        })
            .then(res => {
                if (!siteName || !address || !startDate || !endDate || !contractor || !measurer || !status) {
                    alert("모든 필드를 입력해주세요.")
                    return;
                }
                else {
                    console.log(res);
                    handleCloseModal();
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    // 모달 닫기
    const handleCloseModal = () => {
        setSiteName('');
        setAddress('');
        setStartDate('');
        setEndDate('');
        setContractor('');
        setMeasurer('');
        setStatus('N');
        setSiteGroup('');
        closeModal();
    };

    return (
        <div
            className={`modal fade ${isOpen ? 'show d-block' : ''}`}
            id={'createProject'}
            tabIndex={'-1'}
            aria-labelledby={'cpModalLabel'}
            aria-hidden={!isOpen}
            style={{display: isOpen ? 'block' : 'none'}}
        >
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <span className={'fs-4 modal-title'} id={'cpModalLabel'}>
                            공사개요
                        </span>
                        <button type={'button'}
                                className={'btn-close'}
                                data-bs-dismiss={'modal'}
                                aria-label={'Close'}
                                onClick={handleCloseModal}
                        />
                    </div>
                    <div className={'modal-body'}>
                        <div className={'d-flex flex-column'}>
                            <div className={'d-flex align-items-center'}>
                                <span className={'text-danger'}>*</span>
                                <label htmlFor={'siteName'} className={'form-label'}>
                                    현장명
                                </label>
                            </div>
                            <input type={'text'} className={'form-control'} id={'siteName'} value={siteName} onChange={(e) => setSiteName(e.target.value)}
                                   placeholder={'현장명을 입력하세요'}/>
                            <div className={'d-flex align-items-center mt-2'}>
                                <span className={'text-danger'}>*</span>
                                <label htmlFor={'address'} className={'form-label'}>
                                    주소
                                </label>
                            </div>
                            <input type={'text'} className={'form-control'} id={'address'} value={address} onChange={(e) => setAddress(e.target.value)}
                                   placeholder={'주소를 입력하세요'}/>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'startDate'} className={'form-label'}>
                                            시작일자
                                        </label>
                                    </div>
                                    <input type={'date'} className={'form-control'} id={'startDate'} value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                           placeholder={'시작일자를 입력하세요'}/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'endDate'} className={'form-label'}>
                                            종료일자
                                        </label>
                                    </div>
                                    <input type={'date'} className={'form-control'} id={'endDate'} value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                           placeholder={'종료일자를 입력하세요'}/>
                                </div>
                            </div>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'contractor'} className={'form-label'}>
                                            시공사
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'contractor'} value={contractor} onChange={(e) => setContractor(e.target.value)}
                                           placeholder={'시공사를 입력하세요'}/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'measurer'} className={'form-label'}>
                                            계측사
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'measurer'}
                                           placeholder={'계측사를 입력하세요'} value={measurer} onChange={(e) => setMeasurer(e.target.value)}/>
                                </div>
                            </div>
                            <div className={'d-flex align-items-center mt-2'}>
                                <span className={'text-danger'}>*</span>
                                <label className={'form-label'}>
                                    종료여부
                                </label>
                            </div>
                            <div className={'d-flex gap-2'}>
                                <div className={'form-check form-check-inline'}>
                                    <input className={'form-check-input'} type={'radio'} name={'status'}
                                           id={'going'}
                                           checked={status === 'N'}
                                           onChange={() => setStatus('N')}/>
                                    <label className={'form-check-label'} htmlFor={'going'}>진행</label>
                                </div>
                                <div className={'form-check form-check-inline'}>
                                    <input className={'form-check-input'} type={'radio'} name={'status'}
                                           id={'finish'}
                                           checked={status === 'Y'}
                                           onChange={() => setStatus('Y')}/>
                                    <label className={'form-check-label'} htmlFor={'finish'}>종료</label>
                                </div>
                            </div>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'geometryInfo'} className={'form-label'}>
                                            지오매트리정보
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'geometryInfo'}
                                           placeholder={'지오매트리정보를 입력하세요'} value={geometryData} readOnly/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'workGroup'} className={'form-label'}>
                                        작업그룹
                                    </label>
                                    <select className={'form-select'} id={'workGroup'}>
                                        <option value={''} selected>선택하세요</option>
                                        <option value={'group1'}>그룹 1</option>
                                        <option value={'group2'}>그룹 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={'modal-footer'}>
                            <button type={'button'}
                                    className={'btn btn-outline-dark opacity-50'}
                                    data-bs-dismiss={'modal'}
                                    onClick={handleCloseModal}
                            >
                                Close
                            </button>
                            <button type={'button'}
                                    className={'btn btn-success opacity-50'} onClick={handleCreateProject}
                            >
                                프로젝트 생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ProjectCreateModal;
