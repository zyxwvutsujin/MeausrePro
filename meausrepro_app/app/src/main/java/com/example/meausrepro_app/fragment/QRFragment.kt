package com.example.meausrepro_app.fragment

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.util.Size
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import com.example.meausrepro_app.MainActivity
import com.example.meausrepro_app.R
import com.example.meausrepro_app.databinding.FragmentQRBinding
import com.example.meausrepro_app.db.MeausreProClient
import com.example.meausrepro_app.db.MeausreProInstrument
import com.google.zxing.BinaryBitmap
import com.google.zxing.MultiFormatReader
import com.google.zxing.NotFoundException
import com.google.zxing.PlanarYUVLuminanceSource
import com.google.zxing.common.HybridBinarizer
import retrofit2.Call
import retrofit2.Callback
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import retrofit2.Response


@androidx.camera.core.ExperimentalGetImage
class QRFragment : Fragment() {
    private lateinit var binding: FragmentQRBinding
    private lateinit var cameraExecutor: ExecutorService
    private val multiFormatReader = MultiFormatReader()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentQRBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        cameraExecutor = Executors.newSingleThreadExecutor()

        // 카메라 권한 요청
        requestCameraPermission()

        binding.btnLogout.setOnClickListener {
            showCustomDialog("로그아웃 하시겠습니까?")
        }

        // 플래시 버튼 클릭 리스너
        binding.btnFlash.setOnClickListener {
            // 플래시 기능 구현 (선택 사항)
        }
    }

    private fun requestCameraPermission() {
        if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.CAMERA)
            != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(requireActivity(),
                arrayOf(Manifest.permission.CAMERA), 1001)
        } else {
            startCamera()
        }
    }

    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext())
        cameraProviderFuture.addListener({
            val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()

            // Preview 설정
            val preview = Preview.Builder().build().also {
                it.setSurfaceProvider(binding.qrScanner.surfaceProvider)
            }

            // ImageAnalysis 설정
            val imageAnalysis = ImageAnalysis.Builder()
                .setTargetResolution(Size(640, 480)) // 해상도 변경
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()
                .also {
                    it.setAnalyzer(cameraExecutor, { imageProxy ->
                        processImageProxy(imageProxy)
                    })
                }

            // 카메라 선택
            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
            try {
                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalysis)
            } catch (exc: Exception) {
                Log.e("QRFragment", "Camera binding failed: ${exc.message}")
            }
        }, ContextCompat.getMainExecutor(requireContext()))
    }

    @androidx.camera.core.ExperimentalGetImage
    private fun processImageProxy(imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image
        if (mediaImage != null) {
            val planes = mediaImage.planes
            val buffer = planes[0].buffer
            val bytes = ByteArray(buffer.remaining())
            buffer.get(bytes)

            val source = PlanarYUVLuminanceSource(
                bytes,
                imageProxy.width,
                imageProxy.height,
                0,
                0,
                imageProxy.width,
                imageProxy.height,
                false
            )
            val bitmap = BinaryBitmap(HybridBinarizer(source))

            try {
                val result = multiFormatReader.decode(bitmap)
                val instrIdx = result.text.toIntOrNull() // QR에서 인덱스 값 추출
                if (instrIdx != null) {
                    fetchInstrumentInfo(instrIdx) // 데이터 조회 메서드 호출
                } else {
                    showCustomDialog("유효하지 않은 QR 코드입니다.")
                }
            } catch (e: NotFoundException) {
                Log.e("QRFragment", "QR 코드 인식 실패: ${e.message}")
            } finally {
                imageProxy.close()
            }
        } else {
            imageProxy.close()
        }
    }

    private fun fetchInstrumentInfo(instrIdx: Int) {
        MeausreProClient.retrofit.getInstrumentInfo(instrIdx).enqueue(object : Callback<MeausreProInstrument> {
            override fun onResponse(call: Call<MeausreProInstrument>, response: Response<MeausreProInstrument>) {
                if (response.isSuccessful) {
                    response.body()?.let { instrumentInfo ->
                        // 데이터 처리 (예: 다음 액티비티로 전환)
                        val intent = Intent(requireContext(), InstrumentFragment::class.java)
                        intent.putExtra("idx", instrumentInfo.idx) // 수정된 부분
                        startActivity(intent)
                    }
                } else {
                    showCustomDialog("정보를 가져오는 데 실패했습니다.")
                }
            }

            override fun onFailure(call: Call<MeausreProInstrument>, t: Throwable) {
                showCustomDialog("서버와의 연결에 실패했습니다.")
            }
        })
    }

    private fun showCustomDialog(message: String) {
        val dialogView = LayoutInflater.from(binding.root.context).inflate(R.layout.dialog_confirm, null)
        val builder = AlertDialog.Builder(binding.root.context)
        builder.setView(dialogView)

        val dialog = builder.create()
        val confirmTextView = dialogView.findViewById<TextView>(R.id.confirmTextView)
        confirmTextView.text = message

        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)
        val btnConfirm = dialogView.findViewById<Button>(R.id.btnConfirm)

        btnCancel.setOnClickListener {
            dialog.dismiss()
        }

        btnConfirm.setOnClickListener {
            val intent = Intent(binding.root.context, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            dialog.dismiss()
        }

        dialog.show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        cameraExecutor.shutdown()
    }
}