package com.ilazar.myapp.todo.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.*

@Entity(tableName = "items")
data class Item(@PrimaryKey var _id: String = "",
                var insulinDate: String = getCurrentDate(),
                var insulinTaken: Boolean = false,
                var insulinType: String = "",
                var insulinAmount: Int = 0,
                var isSentToServer: Boolean=true,
                var lat: Double=0.0,
                var lon: Double=0.0
)

fun getCurrentDate(): String{
    val calendar = Calendar.getInstance()

    val year = calendar.get(Calendar.YEAR)
    val month = calendar.get(Calendar.MONTH)
    val day = calendar.get(Calendar.DAY_OF_MONTH)

    return "$year/${month + 1}/$day"
}