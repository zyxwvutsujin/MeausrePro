package com.example.meausrepro_app.fragment

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.util.Size
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import com.example.meausrepro_app.MainActivity
import com.example.meausrepro_android.R
import com.example.meausrepro_android.databinding.FragmentQRBinding
import com.example.meausrepro_app.db.MeausreProClient
import com.example.meausrepro_app.db.MeausreProInstrument
import com.google.zxing.BinaryBitmap
import com.google.zxing.MultiFormatReader
import com.google.zxing.NotFoundException
import com.google.zxing.PlanarYUVLuminanceSource
import com.google.zxing.common.HybridBinarizer
import com.google.zxing.integration.android.IntentIntegrator
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@androidx.camera.core.ExperimentalGetImage
class QRFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var id: String? = null
    lateinit var binding: FragmentQRBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            id = it.getString("id")
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding = FragmentQRBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // 플래시 버튼 클릭
        binding.btnFlash.setOnClickListener {

        }

        // 로그아웃
        binding.btnLogout.setOnClickListener {
            showCustomDialog("로그아웃 하시겠습니까?", "logout")
        }

        // 프래그먼트 시작과 동시에 바코드 스캐너 실행
        binding.qrScanner.apply {
            setStatusText("QR코드를 사각형 안에 비춰주세요.")
            decodeContinuous { result ->
                Log.d("QRTag", result.text);

                val instrIdx = result.text.toInt()
                fetchInstrumentInfo(instrIdx)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        binding.qrScanner.resume()
    }

    override fun onPause() {
        super.onPause()
        binding.qrScanner.pause()
    }
    companion object {
        @JvmStatic
        fun newInstance(id:String) =
            QRFragment().apply {
                arguments = Bundle().apply {
                    putString("id", id)
                }
            }
    }

    // 읽은 값 조회
    private fun fetchInstrumentInfo(instrIdx: Int) {
        MeausreProClient.retrofit.accessInstrument(instrIdx, id!!).enqueue(object:retrofit2.Callback<Boolean>{
            override fun onResponse(call: Call<Boolean>, response: Response<Boolean>) {
                if (response.isSuccessful) {
                    val result = response.body()

                    if (result == true) {
                        // 계측기 값 입력 프래그 먼트 전환
                        val insFragment = InstrumentFragment.newInstance(instrIdx, id.toString())
                        val fragmentManager = requireActivity().supportFragmentManager
                        val fragmentTransaction = fragmentManager.beginTransaction()

                        fragmentTransaction.replace(R.id.mainContainer, insFragment)
                        fragmentTransaction.addToBackStack(null)
                        fragmentTransaction.commit()

                    } else {
                        Log.d("QRTag Response", response.body().toString())
                    }
                }
            }

            override fun onFailure(call: Call<Boolean>, t: Throwable) {
                Log.d("QRTag", t.toString())
            }
        })
    }

    // 커스텀 다이얼로그
    private fun showCustomDialog(message: String, stats:String) {
        val dialogView = LayoutInflater.from(binding.root.context).inflate(R.layout.dialog_confirm, null)
        val builder = AlertDialog.Builder(binding.root.context)
        builder.setView(dialogView)

        val dialog = builder.create()

        val confirmTextView = dialogView.findViewById<TextView>(R.id.confirmTextView)
        confirmTextView.text = message  // 메시지 설정

        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)
        val btnConfirm = dialogView.findViewById<Button>(R.id.btnConfirm)

        btnCancel.setOnClickListener {
            dialog.dismiss() // 취소 버튼 클릭 시 다이얼로그 닫기
        }

        btnConfirm.setOnClickListener {
            if (stats=="logout") {
                // 로그아웃 처리 (MainActivity로 이동)
                val intent = Intent(binding.root.context, MainActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                dialog.dismiss() // 다이얼로그 닫기
            } else {
                dialog.dismiss()
            }
        }

        dialog.show()
    }
}