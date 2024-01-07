package com.ilazar.myapp.todo.ui

import android.annotation.SuppressLint
import android.app.DatePickerDialog
import android.util.Log
import android.widget.DatePicker
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.ClickableText
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.*
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.app.NotificationCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.myapp.R
import com.ilazar.myapp.todo.data.getCurrentDate
import com.ilazar.myapp.todo.ui.item.ItemViewModel
import com.ilazar.myapp.util.MyMap
import com.ilazar.myapp.util.createNotificationChannel
import com.ilazar.myapp.util.showSimpleNotificationWithTapAction
import java.util.*

@SuppressLint("UnusedMaterialScaffoldPaddingParameter")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemScreen(itemId: String?, onClose: () -> Unit) {
    val channelId = "MyTestChannel"
    val localContext = LocalContext.current
    LaunchedEffect(Unit) {
        createNotificationChannel(channelId, localContext)
    }

    val itemViewModel = viewModel<ItemViewModel>(factory = ItemViewModel.Factory(itemId))
    val itemUiState = itemViewModel.uiState
    var insulinDate by rememberSaveable {
        mutableStateOf(
            itemUiState.item?.insulinDate ?: getCurrentDate()
        )
    }
    var insulinTaken by rememberSaveable { mutableStateOf(itemUiState.item?.insulinTaken ?: false) }
    var insulinAmount by rememberSaveable { mutableStateOf(itemUiState.item?.insulinAmount ?: 0) }
    var text by rememberSaveable { mutableStateOf(itemUiState.item?.insulinType ?: "") }
    var lat by rememberSaveable {
        mutableDoubleStateOf(itemUiState.item?.lat ?: 0.0)
    }
    var lon by rememberSaveable {
        mutableDoubleStateOf(itemUiState.item?.lon ?: 0.0)
    }
    val onLocationChanged: (Double, Double) -> Unit = {newLat: Double, newLon: Double ->
        Log.d("MovieScreen", "onLocationChanged: ${newLat}, ${newLon}")
        lat = newLat
        lon = newLon
    }

    Log.d("ItemScreen", "recompose, text = $text")

    LaunchedEffect(itemUiState.savingCompleted) {
        Log.d("ItemScreen", "Saving completed = ${itemUiState.savingCompleted}");
        if (itemUiState.savingCompleted) {
            onClose();
        }
    }

    var textInitialized by remember { mutableStateOf(itemId == null) }
    LaunchedEffect(itemId, itemUiState.isLoading) {
        Log.d("ItemScreen", "Saving completed = ${itemUiState.savingCompleted}");
        if (textInitialized) {
            return@LaunchedEffect
        }
        if (itemUiState.item != null && !itemUiState.isLoading) {
            insulinDate = itemUiState.item.insulinDate
            insulinTaken = itemUiState.item.insulinTaken
            insulinAmount = itemUiState.item.insulinAmount
            text = itemUiState.item.insulinType
            lat = itemUiState.item.lat
            lon = itemUiState.item.lon
            textInitialized = true
        }
    }


    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = stringResource(id = R.string.item)) },
                actions = {
                    Button(
                        onClick = {
                            Log.d("ItemScreen", "save item text = $text")
                            itemViewModel.saveOrUpdateItem(
                                insulinDate,
                                insulinTaken,
                                insulinAmount,
                                text
                            )
                            showSimpleNotificationWithTapAction(
                                localContext,
                                "MyTestChannel",
                                0,
                                "Item Saved",
                                "The item has been successfully saved.",
                                NotificationCompat.PRIORITY_DEFAULT
                            )
                        },
                    ) {
                        Text("Save", color = Color.White)
                    }
                },
                backgroundColor = Color.LightGray
            )
        }
    ) {
        if (itemUiState.isLoading) {
            CircularProgressIndicator()
            return@Scaffold
        }
        Column {
            if (itemUiState.loadingError != null) {
                Text(text = "Failed to load item - ${itemUiState.loadingError.message}")
            }
            Column {
                // Insulin Date Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Text("Insulin Date: ")
                    ClickableText(
                        text = AnnotatedString(insulinDate),
                        onClick = {
                            val calendar = Calendar.getInstance()

                            val year = calendar.get(Calendar.YEAR)
                            val month = calendar.get(Calendar.MONTH)
                            val day = calendar.get(Calendar.DAY_OF_MONTH)

                            val mDatePickerDialog = DatePickerDialog(
                                localContext,
                                { _: DatePicker, cYear: Int, cMonth: Int, cDay: Int ->
                                    insulinDate = "$cYear/${cMonth + 1}/$cDay"
                                }, year, month, day
                            )
                            mDatePickerDialog.show()
                        }
                    )
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Text(text = "Check if insulin is taken:")
                    Checkbox(
                        checked = insulinTaken,
                        onCheckedChange = { insulinTaken = it }
                    )
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    TextField(
                        value = insulinAmount.toString(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        onValueChange = {
                            insulinAmount = try {
                                it.toInt()
                            } catch (e: Exception) {
                                0
                            }
                        },
                        label = { Text("Insulin Amount") },
                    )
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    TextField(
                        value = text,
                        onValueChange = { text = it },
                        label = { Text("Insulin Type") },
                    )
                }

                Row{
                    MyMap(lat = lat, lon = lon, onLocationChanged = onLocationChanged)
                }

            }
            if (itemUiState.isSaving) {
                Column(
                    Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) { LinearProgressIndicator() }
            }
            if (itemUiState.savingError != null) {
                Text(text = "Failed to save item - ${itemUiState.savingError.message}")
            }
        }
    }
}

@Preview
@Composable
fun PreviewItemScreen() {
    ItemScreen(itemId = "0", onClose = {})
}
