package com.example.meausrepro_app.fragment

import android.content.Intent
import android.os.Bundle
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

        // 로그아웃
        binding.btnLogout.setOnClickListener {
            showCustomDialog("로그아웃 하시겠습니까?")
        }

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

    // 커스텀 다이얼로그
    private fun showCustomDialog(message: String) {
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
            // 로그아웃 처리 (MainActivity로 이동)
            val intent = Intent(binding.root.context, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            dialog.dismiss() // 다이얼로그 닫기
        }

        dialog.show()
    }
}